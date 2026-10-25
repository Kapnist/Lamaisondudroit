import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type LawyerDocumentType = 'diploma' | 'registration' | 'bar' | 'oath' | 'internship'
export type LawyerDocuments = Record<LawyerDocumentType, File>
export type LawyerAuthMode = 'signup' | 'signin'

export type LawyerApplicationInput = {
  authMode: LawyerAuthMode
  email: string
  password: string
  fullName: string
  profession: 'Avocat' | 'Notaire' | 'Juriste'
  lawyerStatus: 'Titulaire' | 'Stagiaire' | null
  city: string
  categories: string[]
  photo: File | null
  presentationSections: PresentationSection[]
  diploma: string
  registrationNumber: string
  barAssociation: string
  oathCity: string
  internshipFirm: string
  documents: LawyerDocuments | null
}

export type PresentationSection = { title: string; text: string }

const documentLabels: Record<LawyerDocumentType, string> = {
  diploma: 'diplôme',
  registration: 'matricule',
  bar: 'inscription à l’Ordre',
  oath: 'prestation de serment',
  internship: 'stage en cabinet',
}

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])
const maximumFileSize = 10 * 1024 * 1024
const maximumPhotoSize = 5 * 1024 * 1024

function validatePhoto(photo: File | null) {
  if (!photo) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)) {
    throw new Error('La photo doit être au format JPG, PNG ou WebP.')
  }
  if (photo.size === 0 || photo.size > maximumPhotoSize) {
    throw new Error('La photo doit peser au maximum 5 Mo.')
  }
}

function validateDocuments(documents: LawyerDocuments | null) {
  if (!documents) {
    throw new Error('Les cinq justificatifs d’avocat sont obligatoires.')
  }
  if (Object.keys(documents).length !== Object.keys(documentLabels).length) {
    throw new Error('Les cinq justificatifs d’avocat sont obligatoires.')
  }
  for (const [kind, file] of Object.entries(documents) as [LawyerDocumentType, File][]) {
    const extension = file.name.split('.').pop()?.toLocaleLowerCase('en')
    const validExtension = ['pdf', 'jpg', 'jpeg', 'png'].includes(extension ?? '')
    if (!validExtension || !allowedTypes.has(file.type)) {
      throw new Error(`Le justificatif du ${documentLabels[kind]} doit être un PDF ou une image JPG/PNG.`)
    }
    if (file.size === 0 || file.size > maximumFileSize) {
      throw new Error(`Le justificatif du ${documentLabels[kind]} doit peser au maximum 10 Mo.`)
    }
  }
}

function getClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Le service de candidature sécurisé n’est pas configuré.')
  }
  return supabase
}

export async function submitLawyerApplication(input: LawyerApplicationInput) {
  if (input.profession === 'Avocat') validateDocuments(input.documents)
  validatePhoto(input.photo)
  const client = getClient()

  const authResult =
    input.authMode === 'signup'
      ? await client.auth.signUp({
          email: input.email,
          password: input.password,
          options: { emailRedirectTo: `${window.location.origin}/professionnels/inscription` },
        })
      : await client.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        })

  if (authResult.error) {
    throw new Error(`Authentification impossible : ${authResult.error.message}`)
  }
  if (!authResult.data.session) {
    return { status: 'confirmation_required' as const }
  }

  const ownerId = authResult.data.session.user.id
  const submissionId = crypto.randomUUID()
  const entries = input.profession === 'Avocat'
    ? Object.entries(input.documents ?? {}) as [LawyerDocumentType, File][]
    : []
  const uploadedPaths: string[] = []
  const documentPaths: Partial<Record<LawyerDocumentType, string>> = {}
  let photoPath: string | null = null

  if (input.photo) {
    const extension = input.photo.name.split('.').pop()?.toLocaleLowerCase('en') ?? ''
    photoPath = `${ownerId}/${crypto.randomUUID()}.${extension}`
    const { error } = await client.storage
      .from('professional-avatars')
      .upload(photoPath, input.photo, { contentType: input.photo.type, upsert: false })
    if (error) {
      throw new Error(`Échec du téléversement de la photo de profil : ${error.message}`)
    }
  }

  for (const [kind, file] of entries) {
    const extension = file.name.split('.').pop()?.toLocaleLowerCase('en') ?? ''
    const path = `${ownerId}/${submissionId}/${kind}.${extension}`
    const { error } = await client.storage
      .from('lawyer-verification')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (error) {
      const cleanupError = await removeUnattachedFiles(client, uploadedPaths, photoPath)
      throw new Error(
        `Échec du téléversement du justificatif « ${documentLabels[kind]} » : ${error.message}${cleanupError ? ` Le nettoyage des fichiers temporaires a aussi échoué : ${cleanupError}` : ''}`,
      )
    }
    uploadedPaths.push(path)
    documentPaths[kind] = path
  }

  const rpc = input.profession === 'Avocat'
    ? client.rpc('submit_lawyer_application', {
    p_submission_id: submissionId,
    p_full_name: input.fullName.trim(),
    p_lawyer_status: input.lawyerStatus,
    p_city: input.city,
    p_categories: input.categories,
    p_diploma: input.diploma.trim(),
    p_registration_number: input.registrationNumber.trim(),
    p_bar_association: input.barAssociation.trim(),
    p_oath_city: input.oathCity.trim(),
    p_internship_firm: input.internshipFirm.trim(),
    p_document_paths: documentPaths,
    p_photo_path: photoPath,
    p_presentation_sections: input.presentationSections,
  })
    : client.rpc('submit_professional_application', {
        p_full_name: input.fullName.trim(),
        p_profession: input.profession,
        p_city: input.city,
        p_categories: input.categories,
        p_photo_path: photoPath,
        p_presentation_sections: input.presentationSections,
      })
  const { data, error } = await rpc

  if (error) {
    const cleanupError = await removeUnattachedFiles(client, uploadedPaths, photoPath)
    throw new Error(
      `La candidature n’a pas été enregistrée : ${error.message}${cleanupError ? ` Le nettoyage des fichiers temporaires a aussi échoué : ${cleanupError}` : ''}`,
    )
  }

  return { status: 'submitted' as const, profileId: data }
}

async function removeUnattachedFiles(client: SupabaseClient, paths: string[], photoPath: string | null) {
  const documentResult = paths.length
    ? await client.storage.from('lawyer-verification').remove(paths)
    : { error: null }
  const photoResult = photoPath
    ? await client.storage.from('professional-avatars').remove([photoPath])
    : { error: null }
  const errors = [documentResult.error?.message, photoResult.error?.message].filter(Boolean)
  return errors.length ? errors.join('; ') : null
}
