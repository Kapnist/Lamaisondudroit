import draftPortrait from '../assets/noupa-rudi-draft.jpg'

export type DraftProfessionalProfile = {
  name: string
  profession: string
  specialty: string
  city: string | null
  verified: false
  published: false
  reviewStatus: 'pending_verification'
  profileImage: string
  imageNotice: string
  presentation: {
    title: string
    introduction: string
    concerns: Array<{
      title: string
      description: string
    }>
    approachTitle: string
    approach: string
    firstStepTitle: string
    firstStep: string
  }
  firstConsultation: {
    label: string
    durationMinutes: number
    priceXaf: number
  }
}

export const noupaRudiDraft: DraftProfessionalProfile = {
  name: 'Maître Noupa Rudi',
  profession: 'Avocat',
  specialty: 'Droit de la famille',
  city: null,
  verified: false,
  published: false,
  reviewStatus: 'pending_verification',
  profileImage: draftPortrait,
  imageNotice:
    "Recadrage du visuel fourni pour cette maquette. L'identité de la personne et l'autorisation d'utiliser son image restent à confirmer.",
  presentation: {
    title: 'Droit de la famille : protéger vos droits, préparer votre avenir.',
    introduction:
      "Face aux épreuves de la vie familiale, il peut être difficile de savoir vers qui se tourner. Je vous propose une écoute attentive, des informations claires et un accompagnement adapté à votre situation et au droit applicable.",
    concerns: [
      {
        title: 'Violences conjugales',
        description:
          "En cas de violences physiques, psychologiques, verbales ou économiques, votre sécurité et celle de vos proches passent d’abord. Nous pouvons examiner les démarches et mesures de protection envisageables selon votre situation. En cas de danger immédiat, contactez les services d’urgence compétents.",
      },
      {
        title: 'Violences familiales et protection des enfants',
        description:
          "Lorsqu’un enfant est exposé à des violences ou à des maltraitances, il est essentiel d’agir rapidement. Je peux vous accompagner pour identifier les interlocuteurs compétents et les démarches appropriées, dans le respect de l’intérêt de l’enfant et du droit applicable.",
      },
      {
        title: 'Séparations et litiges familiaux',
        description:
          "Divorce, séparation, organisation de la garde des enfants ou désaccords sur le patrimoine : chaque situation mérite une analyse attentive. Nous examinerons les éléments de votre dossier et les options possibles pour défendre vos intérêts.",
      },
    ],
    approachTitle: 'Une approche humaine et un accompagnement sur mesure',
    approach:
      "Le droit de la famille demande de la rigueur et une écoute attentive. Je vous accompagne à chaque étape, de la recherche d’une solution amiable aux démarches contentieuses lorsque celles-ci sont nécessaires.",
    firstStepTitle: 'Le premier pas vers plus de clarté',
    firstStep:
      "Le premier entretien de 45 minutes permettrait de présenter votre situation, d’identifier les informations utiles et d’échanger sur les suites envisageables. Les informations de durée et de tarif restent à confirmer avant toute réservation.",
  },
  firstConsultation: {
    label: 'Premier entretien',
    durationMinutes: 45,
    priceXaf: 10_000,
  },
}
