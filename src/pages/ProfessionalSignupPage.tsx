import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BriefcaseBusiness, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cities, getRegionForCity, legalCategories, professions } from '../data/catalogue'
import { saveDevelopmentRegistration } from '../data/developmentRegistrations'

type SignupPreview = {
  name: string
  profession: string
  city: string
  categories: string[]
}

export function ProfessionalSignupPage() {
  const [preview, setPreview] = useState<SignupPreview | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
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
    const registration = {
      name: String(formData.get('name')).trim(),
      profession: String(formData.get('profession')),
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
          <p>Formulaire de préparation : vos choix sont conservés dans ce navigateur de développement pour tester leur affichage dans l’annuaire. Ils ne sont pas envoyés au serveur et ne sont visibles que sur cet appareil. Une inscription partagée entre utilisateurs nécessitera un backend et une vérification professionnelle.</p>
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
              <select id="signup-profession" name="profession" defaultValue="" required>
                <option value="" disabled>Choisir une profession</option>
                {professions.map((profession) => <option key={profession} value={profession}>{profession}</option>)}
              </select>
            </label>

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
            <p>{preview.profession} · {preview.city}</p>
            <ul className="signup-preview__categories">
              {preview.categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
            <strong>Enregistré dans ce navigateur de développement; profil en attente de vérification.</strong>
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
