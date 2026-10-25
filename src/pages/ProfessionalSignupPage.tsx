import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BriefcaseBusiness, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cities, getRegionForCity, legalCategories, professions } from '../data/catalogue'
import { saveDevelopmentRegistration } from '../data/developmentRegistrations'

type LawyerStatus = 'Titulaire' | 'Stagiaire'

type SignupPreview = {
  name: string
  profession: string
  lawyerStatus?: LawyerStatus
  city: string
  categories: string[]
}

function isLawyerStatus(value: FormDataEntryValue | null): value is LawyerStatus {
  return value === 'Titulaire' || value === 'Stagiaire'
}

export function ProfessionalSignupPage() {
  const [preview, setPreview] = useState<SignupPreview | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProfession, setSelectedProfession] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [submissionError, setSubmissionError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selectedCategories.length === 0) {
      setCategoryError('Choisissez au moins une catégorie correspondant à vos compétences.')
      document.getElementById('signup-category-0')?.focus()
      return
    }

    const formData = new FormData(event.currentTarget)
    const profession = String(formData.get('profession'))
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
    setPreview(registration)
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
          <p>Les justificatifs sont obligatoires pour préparer une candidature d’avocat. Cette version de démonstration ne téléverse ni ne conserve les fichiers : ne sélectionnez pas de vrais documents. Un stockage sécurisé et la vérification par un administrateur seront nécessaires avant toute consultation.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form__intro">
            <span className="signup-form__icon"><BriefcaseBusiness size={20} /></span>
            <div><h2>Votre profil professionnel</h2><p>Les champs marqués d’un astérisque sont requis.</p></div>
          </div>

          <div className="signup-fields">
            <label className="signup-field signup-field--wide" htmlFor="signup-name">
              <span>Nom et prénom <b aria-hidden="true">*</b></span>
              <input id="signup-name" name="name" autoComplete="name" placeholder="Ex. Maître Amina Ngu" required />
            </label>

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
          </div>

          <button className="button button--nav signup-submit" type="submit">
            Enregistrer un aperçu local <ArrowRight size={16} />
          </button>
          {submissionError && <p className="signup-submit-error" role="alert">{submissionError}</p>}
        </form>

        {preview && (
          <section className="signup-preview" aria-live="polite" aria-label="Aperçu local — non transmis au serveur">
            <span className="eyebrow">Aperçu local — non transmis au serveur</span>
            <h2>{preview.name}</h2>
            <p>{preview.profession}{preview.lawyerStatus ? ` ${preview.lawyerStatus.toLocaleLowerCase('fr')}` : ''} · {preview.city}</p>
            <ul className="signup-preview__categories">
              {preview.categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
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
