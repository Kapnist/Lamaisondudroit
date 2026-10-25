import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BriefcaseBusiness, Plus, ShieldAlert, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cities, getRegionForCity, legalCategories, professions } from '../data/catalogue'
import { saveDevelopmentRegistration } from '../data/developmentRegistrations'
import { supabase, supabaseConfigurationError } from '../lib/supabase'
import { submitLawyerApplication } from '../services/lawyerApplications'
import type { LawyerAuthMode, PresentationSection } from '../services/lawyerApplications'

type LawyerStatus = 'Titulaire' | 'Stagiaire'

type SignupPreview = {
  name: string
  profession: string
  lawyerStatus?: LawyerStatus
  city: string
  categories: string[]
  presentationSections: PresentationSection[]
}

function isLawyerStatus(value: FormDataEntryValue | null): value is LawyerStatus {
  return value === 'Titulaire' || value === 'Stagiaire'
}

function isProfession(value: string): value is (typeof professions)[number] {
  return professions.some((profession) => profession === value)
}

function getRequiredFile(formData: FormData, name: string): File {
  const file = formData.get(name)
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Les cinq justificatifs d’avocat sont obligatoires.')
  }
  return file
}

export function ProfessionalSignupPage() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<SignupPreview | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProfession, setSelectedProfession] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [authMode, setAuthMode] = useState<LawyerAuthMode>('signup')
  const [presentationSections, setPresentationSections] = useState<PresentationSection[]>([{ title: '', text: '' }])

  useEffect(() => {
    if (!photo) {
      setPhotoPreview('')
      return
    }
    const objectUrl = URL.createObjectURL(photo)
    setPhotoPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (supabaseConfigurationError) {
      setSubmissionError(supabaseConfigurationError)
      return
    }
    if (selectedCategories.length === 0) {
      setCategoryError('Choisissez au moins une catégorie correspondant à vos compétences.')
      document.getElementById('signup-category-0')?.focus()
      return
    }

    const formData = new FormData(event.currentTarget)
    const profession = String(formData.get('profession'))
    if (!isProfession(profession)) {
      setSubmissionError('Choisissez une profession valide.')
      return
    }
    const lawyerStatus = formData.get('lawyerStatus')
    if (profession === 'Avocat') {
      const requiredLawyerFields = [
        'lawyerDiploma',
        'lawyerMatricule',
        'lawyerBar',
        'lawyerOathCity',
        'lawyerInternship',
      ]
      const requiredProofs = [
        'proofDiploma',
        'proofMatricule',
        'proofBar',
        'proofOath',
        'proofInternship',
      ]
      const missingField = requiredLawyerFields.some((name) => !String(formData.get(name) ?? '').trim())
      const missingProof = requiredProofs.some((name) => {
        const file = formData.get(name)
        return !(file instanceof File) || file.size === 0
      })
      if (!isLawyerStatus(lawyerStatus) || missingField || missingProof) {
        setSubmissionError('Le statut, les informations professionnelles et les cinq justificatifs d’avocat sont obligatoires.')
        return
      }
    }

    const registration = {
      name: String(formData.get('name')).trim(),
      profession,
      ...(profession === 'Avocat' && isLawyerStatus(lawyerStatus) ? { lawyerStatus } : {}),
      city: String(formData.get('city')),
      categories: selectedCategories,
    }
    if (!registration.name || !registration.profession || !registration.city) return

    const validPresentation = presentationSections
      .map(({ title, text }) => ({ title: title.trim(), text: text.trim() }))
      .filter(({ title, text }) => title || text)
    if (validPresentation.length === 0 || validPresentation.some(({ title, text }) => !title || !text)) {
      setSubmissionError('Chaque section de présentation doit comporter un titre et un texte.')
      return
    }
    if (validPresentation.length > 12) {
      setSubmissionError('Vous pouvez ajouter jusqu’à 12 sections de présentation.')
      return
    }

    if (supabase) {
      let lawyerDocuments = null
      if (profession === 'Avocat') {
        try {
          lawyerDocuments = {
            diploma: getRequiredFile(formData, 'proofDiploma'),
            registration: getRequiredFile(formData, 'proofMatricule'),
            bar: getRequiredFile(formData, 'proofBar'),
            oath: getRequiredFile(formData, 'proofOath'),
            internship: getRequiredFile(formData, 'proofInternship'),
          }
        } catch (error) {
          setSubmissionError(error instanceof Error ? error.message : 'Les justificatifs sont incomplets.')
          return
        }
      }
      const email = String(formData.get('email') ?? '').trim()
      const password = String(formData.get('password') ?? '')
      if (!email || password.length < 12) {
        setSubmissionError('Saisissez une adresse électronique et un mot de passe de 12 caractères minimum.')
        return
      }

      setIsSubmitting(true)
      setSubmissionError('')
      setSubmissionMessage('')
      try {
        const result = await submitLawyerApplication({
          authMode,
          email,
          password,
          fullName: registration.name,
          profession: registration.profession,
          lawyerStatus: registration.lawyerStatus ?? null,
          city: registration.city,
          categories: registration.categories,
          photo,
          presentationSections: validPresentation,
          diploma: String(formData.get('lawyerDiploma') ?? ''),
          registrationNumber: String(formData.get('lawyerMatricule') ?? ''),
          barAssociation: String(formData.get('lawyerBar') ?? ''),
          oathCity: String(formData.get('lawyerOathCity') ?? ''),
          internshipFirm: String(formData.get('lawyerInternship') ?? ''),
          documents: lawyerDocuments,
        })
        if (result.status === 'confirmation_required') {
          setSubmissionMessage('Votre compte a été créé. Confirmez votre adresse électronique, puis connectez-vous depuis votre tableau de bord avant de revenir envoyer votre candidature.')
          return
        }
        setSubmissionMessage('Votre candidature a été transmise de façon sécurisée. Votre profil et sa photo resteront privés jusqu’à validation.')
        window.setTimeout(() => navigate('/professionnel/tableau-de-bord'), 1000)
      } catch (error) {
        setSubmissionError(error instanceof Error ? error.message : 'La candidature n’a pas pu être transmise.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    try {
      saveDevelopmentRegistration(registration)
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'Impossible d’enregistrer cette prévisualisation locale.',
      )
      return
    }

    setCategoryError('')
    setSubmissionError('')
    setSubmissionMessage('')
    setPreview({ ...registration, presentationSections: validPresentation })
  }

  function toggleCategory(category: string) {
    setSelectedCategories((selected) =>
      selected.includes(category)
        ? selected.filter((item) => item !== category)
        : [...selected, category],
    )
    setCategoryError('')
    setPreview(null)
  }

  return (
    <section className="signup-page">
      <div className="container signup-container">
        <div className="breadcrumbs"><Link to="/">Accueil</Link><span>/</span><span>Inscription professionnelle</span></div>
        <div className="signup-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> Rejoindre la plateforme</span>
          <h1>Présentez votre <em>expertise.</em></h1>
          <p>Sélectionnez une ou plusieurs catégories correspondant à vos domaines d’activité.</p>
        </div>

        <div className="signup-notice" role="note">
          <ShieldAlert size={19} />
          <p>{supabase ? 'La photo et les justificatifs d’avocat sont transmis au stockage Supabase configuré. Les justificatifs restent privés et le profil ne sera public qu’après validation.' : 'Sans configuration Supabase, ce formulaire ne crée qu’un aperçu local. Les photos et justificatifs ne sont ni transmis ni conservés : ne sélectionnez pas de vrais documents en mode démonstration.'}</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form__intro">
            <span className="signup-form__icon"><BriefcaseBusiness size={20} /></span>
            <div><h2>Votre profil professionnel</h2><p>Les champs marqués d’un astérisque sont requis.</p></div>
          </div>

          <div className="signup-fields">
            {supabase && (
              <>
                <div className="account-mode signup-field signup-field--wide" role="group" aria-label="Mode de connexion">
                  <button className={authMode === 'signup' ? 'account-mode__active' : ''} type="button" onClick={() => setAuthMode('signup')}>Créer un compte</button>
                  <button className={authMode === 'signin' ? 'account-mode__active' : ''} type="button" onClick={() => setAuthMode('signin')}>J’ai déjà un compte</button>
                </div>
                <label className="signup-field" htmlFor="signup-email">
                  <span>Adresse électronique <b aria-hidden="true">*</b></span>
                  <input id="signup-email" name="email" type="email" autoComplete="email" required />
                </label>
                <label className="signup-field" htmlFor="signup-password">
                  <span>Mot de passe (12 caractères minimum) <b aria-hidden="true">*</b></span>
                  <input id="signup-password" name="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} minLength={12} required />
                </label>
              </>
            )}

            <label className="signup-field signup-field--wide" htmlFor="signup-name">
              <span>Nom et prénom <b aria-hidden="true">*</b></span>
              <input id="signup-name" name="name" autoComplete="name" placeholder="Ex. Maître Amina Ngu" required />
            </label>

            <div className="signup-field signup-field--wide">
              <label htmlFor="signup-photo">Photo de profil (JPG, PNG ou WebP, 5 Mo maximum)</label>
              <input id="signup-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
              {photoPreview && <img className="signup-photo-preview" src={photoPreview} alt="Aperçu de la photo de profil" />}
            </div>

            <label className="signup-field" htmlFor="signup-profession">
              <span>Profession <b aria-hidden="true">*</b></span>
              <select
                id="signup-profession"
                name="profession"
                value={selectedProfession}
                onChange={(event) => setSelectedProfession(event.target.value)}
                required
              >
                <option value="" disabled>Choisir une profession</option>
                {professions.map((profession) => <option key={profession} value={profession}>{profession}</option>)}
              </select>
            </label>

            {selectedProfession === 'Avocat' && (
              <>
                <label className="signup-field" htmlFor="signup-lawyer-status">
                  <span>Statut de l’avocat <b aria-hidden="true">*</b></span>
                  <select id="signup-lawyer-status" name="lawyerStatus" defaultValue="" required>
                    <option value="" disabled>Choisir un statut</option>
                    <option value="Titulaire">Avocat titulaire</option>
                    <option value="Stagiaire">Avocat stagiaire</option>
                  </select>
                </label>
                <label className="signup-field" htmlFor="signup-lawyer-diploma">
                  <span>Diplôme obtenu <b aria-hidden="true">*</b></span>
                  <input id="signup-lawyer-diploma" name="lawyerDiploma" required placeholder="Intitulé du diplôme" />
                </label>
                <label className="signup-field" htmlFor="signup-lawyer-matricule">
                  <span>Matricule professionnel <b aria-hidden="true">*</b></span>
                  <input id="signup-lawyer-matricule" name="lawyerMatricule" required />
                </label>
                <label className="signup-field" htmlFor="signup-lawyer-bar">
                  <span>Ordre / barreau d’inscription <b aria-hidden="true">*</b></span>
                  <input id="signup-lawyer-bar" name="lawyerBar" required placeholder="Ordre des avocats compétent" />
                </label>
                <label className="signup-field" htmlFor="signup-lawyer-oath-city">
                  <span>Ville de prestation de serment <b aria-hidden="true">*</b></span>
                  <input id="signup-lawyer-oath-city" name="lawyerOathCity" required />
                </label>
                <label className="signup-field signup-field--wide" htmlFor="signup-lawyer-internship">
                  <span>Cabinet où le stage a été effectué <b aria-hidden="true">*</b></span>
                  <input id="signup-lawyer-internship" name="lawyerInternship" required />
                </label>
                <fieldset className="signup-field signup-field--wide signup-category-group">
                  <legend>Justificatifs obligatoires <b aria-hidden="true">*</b></legend>
                  <p className="signup-category-intro">Pour la maquette, les fichiers doivent être sélectionnés afin de tester le formulaire. Ils ne sont pas envoyés ni enregistrés.</p>
                  <div className="signup-fields">
                    <label className="signup-field" htmlFor="signup-proof-diploma">
                      <span>Justificatif du diplôme <b aria-hidden="true">*</b></span>
                      <input id="signup-proof-diploma" name="proofDiploma" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </label>
                    <label className="signup-field" htmlFor="signup-proof-matricule">
                      <span>Justificatif du matricule <b aria-hidden="true">*</b></span>
                      <input id="signup-proof-matricule" name="proofMatricule" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </label>
                    <label className="signup-field" htmlFor="signup-proof-bar">
                      <span>Justificatif d’inscription à l’Ordre <b aria-hidden="true">*</b></span>
                      <input id="signup-proof-bar" name="proofBar" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </label>
                    <label className="signup-field" htmlFor="signup-proof-oath">
                      <span>Attestation de prestation de serment <b aria-hidden="true">*</b></span>
                      <input id="signup-proof-oath" name="proofOath" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </label>
                    <label className="signup-field signup-field--wide" htmlFor="signup-proof-internship">
                      <span>Justificatif du stage en cabinet <b aria-hidden="true">*</b></span>
                      <input id="signup-proof-internship" name="proofInternship" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </label>
                  </div>
                </fieldset>
              </>
            )}

            <label className="signup-field" htmlFor="signup-city">
              <span>Ville d’exercice <b aria-hidden="true">*</b></span>
              <select id="signup-city" name="city" defaultValue="" required>
                <option value="" disabled>Choisir une ville</option>
                {cities.map((city) => <option key={city} value={city}>{city} — région {getRegionForCity(city)}</option>)}
              </select>
            </label>

            <fieldset className="signup-field signup-field--wide signup-category-group" aria-required="true" aria-describedby={categoryError ? 'signup-category-error signup-category-help' : 'signup-category-help'}>
              <legend>Catégories juridiques <b aria-hidden="true">*</b></legend>
              <p className="signup-category-intro">Sélectionnez toutes les catégories qui correspondent à votre pratique. Vous pourrez les modifier avant la publication de votre profil.</p>
              <div className="signup-category-options">
                {legalCategories.map((category, index) => (
                  <label className="signup-category-option" key={category}>
                    <input
                      id={`signup-category-${index}`}
                      type="checkbox"
                      name="categories"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
              {categoryError && <span className="signup-category-error" id="signup-category-error" role="alert">{categoryError}</span>}
              <small id="signup-category-help">Choisissez au moins une catégorie. Les domaines déclarés seront soumis à vérification et ne constituent pas une certification de compétence.</small>
            </fieldset>

            <fieldset className="signup-field signup-field--wide signup-category-group">
              <legend>Votre présentation</legend>
              <p className="signup-category-intro">Ajoutez une ou plusieurs sections. Chaque section comprend un titre et un texte, comme dans la présentation du profil de démonstration.</p>
              {presentationSections.map((section, index) => (
                <div className="presentation-editor" key={index}>
                  <label className="signup-field" htmlFor={`signup-presentation-title-${index}`}>
                    <span>Titre de la section {index + 1} <b aria-hidden="true">*</b></span>
                    <input
                      id={`signup-presentation-title-${index}`}
                      value={section.title}
                      maxLength={120}
                      onChange={(event) => setPresentationSections((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))}
                    />
                  </label>
                  <label className="signup-field" htmlFor={`signup-presentation-text-${index}`}>
                    <span>Texte <b aria-hidden="true">*</b></span>
                    <textarea
                      id={`signup-presentation-text-${index}`}
                      value={section.text}
                      maxLength={5000}
                      rows={5}
                      onChange={(event) => setPresentationSections((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item))}
                    />
                  </label>
                  {presentationSections.length > 1 && (
                    <button className="presentation-remove" type="button" onClick={() => setPresentationSections((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                      <Trash2 size={14} /> Supprimer cette section
                    </button>
                  )}
                </div>
              ))}
              <button className="presentation-add" type="button" disabled={presentationSections.length >= 12} onClick={() => setPresentationSections((current) => [...current, { title: '', text: '' }])}>
                <Plus size={15} /> Ajouter une section
              </button>
            </fieldset>
          </div>

          <button className="button button--nav signup-submit" type="submit">
            {isSubmitting ? 'Transmission en cours…' : supabase ? authMode === 'signup' ? 'Créer mon compte et envoyer ma candidature' : 'Me connecter et envoyer ma candidature' : 'Enregistrer un aperçu local'} <ArrowRight size={16} />
          </button>
          {submissionError && <p className="signup-submit-error" role="alert">{submissionError}</p>}
          {submissionMessage && <p className="signup-submit-success" role="status">{submissionMessage}</p>}
          {submissionMessage.includes('Confirmez votre adresse') && (
            <Link className="button button--outline" to="/professionnel/tableau-de-bord">Ouvrir le tableau de bord pour me connecter <ArrowRight size={15} /></Link>
          )}
        </form>

        {preview && (
          <section className="signup-preview" aria-live="polite" aria-label="Aperçu local — non transmis au serveur">
            <span className="eyebrow">Aperçu local — non transmis au serveur</span>
            <h2>{preview.name}</h2>
            <p>{preview.profession}{preview.lawyerStatus ? ` ${preview.lawyerStatus.toLocaleLowerCase('fr')}` : ''} · {preview.city}</p>
            <ul className="signup-preview__categories">
              {preview.categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
            <div className="signup-preview__presentation">
              {preview.presentationSections.map((section, index) => (
                <article key={`${section.title}-${index}`}>
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </article>
              ))}
            </div>
            <strong>Maquette locale uniquement — profil non vérifié. Les fichiers ne sont pas téléversés. Aucune consultation ne peut être proposée avant validation réelle.</strong>
            <Link className="button button--nav signup-preview__link" to={`/professionnels?q=${encodeURIComponent(preview.categories[0] ?? '')}`}>
              Voir dans l’annuaire de démonstration <ArrowRight size={15} />
            </Link>
          </section>
        )}

        <p className="signup-footnote">
          En développement, les aperçus sont conservés dans ce navigateur et accessibles depuis l’annuaire. En production, les profils devront être transmis au serveur et leur statut contrôlé avant publication.
        </p>
      </div>
    </section>
  )
}
