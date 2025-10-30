export type FormType = 'kozijnen' | 'vloeren' | 'schilderwerk'

export interface FormConfig {
  id: FormType
  title: string
  description: string
  icon: string
  photoPrompt: string
  aiPrompt: string
  fields: {
    materialOptions: Array<{ value: string; label: string }>
    colorOptions?: Array<{ value: string; label: string }>
    patternOptions?: Array<{ value: string; label: string }>
    additionalQuestions: Array<{
      id: string
      label: string
      type: 'select' | 'radio' | 'checkbox' | 'number'
      options?: Array<{ value: string; label: string }>
    }>
  }
  pricing: {
    basePrice: number
    unit: string
    extras: Record<string, number>
  }
}

export const formConfigs: Record<FormType, FormConfig> = {
  kozijnen: {
    id: 'kozijnen',
    title: 'Kozijnen Offerte',
    description: 'Direct een prijsindicatie en AI preview van uw nieuwe kozijnen',
    icon: '🪟',
    photoPrompt: 'Upload foto\'s van uw huidige kozijnen',
    aiPrompt: 'Analyseer deze kozijnen/ramen en genereer een preview met moderne kunststof kozijnen. Behoud de architectuur maar vernieuw de frames met witte kunststof ramen met dubbel glas.',
    fields: {
      materialOptions: [
        { value: 'kunststof', label: 'Kunststof' },
        { value: 'hout', label: 'Hout' },
        { value: 'aluminium', label: 'Aluminium' },
      ],
      colorOptions: [
        { value: 'wit', label: 'Wit' },
        { value: 'grijs', label: 'Grijs' },
        { value: 'antraciet', label: 'Antraciet' },
        { value: 'houtkleur', label: 'Houtkleur' },
      ],
      additionalQuestions: [
        {
          id: 'frameType',
          label: 'Type kozijn',
          type: 'radio',
          options: [
            { value: 'draai', label: 'Draairaam' },
            { value: 'schuif', label: 'Schuifraam' },
            { value: 'vast', label: 'Vast glas' },
          ]
        },
        {
          id: 'glassType',
          label: 'Type beglazing',
          type: 'radio',
          options: [
            { value: 'dubbel', label: 'Dubbel glas' },
            { value: 'triple', label: 'Triple glas (HR++)' },
          ]
        }
      ]
    },
    pricing: {
      basePrice: 450,
      unit: 'per raam',
      extras: {
        hrGlass: 150,
        color: 75,
      }
    }
  },
  
  vloeren: {
    id: 'vloeren',
    title: 'Vloeren Offerte',
    description: 'Direct een prijsindicatie en AI preview van uw nieuwe vloer',
    icon: '🪵',
    photoPrompt: 'Upload foto\'s van uw huidige vloer en ruimte',
    aiPrompt: 'Analyseer deze vloer en ruimte. Genereer een realistische preview met een nieuwe {material} vloer in {color} kleur met {pattern} legpatroon. Behoud perspectief en lichtinval.',
    fields: {
      materialOptions: [
        { value: 'hout-laminaat', label: 'Houten vloer - Laminaat' },
        { value: 'hout-parket', label: 'Houten vloer - Parket' },
        { value: 'pvc-strips', label: 'PVC - Strips' },
        { value: 'pvc-tegels', label: 'PVC - Tegels' },
      ],
      colorOptions: [
        { value: 'licht-eiken', label: 'Licht eiken' },
        { value: 'donker-walnoot', label: 'Donker walnoot' },
        { value: 'grijs', label: 'Grijs' },
        { value: 'wit', label: 'Wit' },
        { value: 'naturel', label: 'Naturel' },
      ],
      patternOptions: [
        { value: 'visgraat', label: 'Visgraat' },
        { value: 'ships-deck', label: 'Ships Deck (standaard)' },
        { value: 'hongaarse-punt', label: 'Hongaarse punt' },
      ],
      additionalQuestions: [
        {
          id: 'area',
          label: 'Oppervlakte (m²)',
          type: 'number',
        },
        {
          id: 'underfloorHeating',
          label: 'Vloerverwarming aanwezig?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Ja' },
            { value: 'no', label: 'Nee' },
          ]
        },
        {
          id: 'removeOld',
          label: 'Oude vloer verwijderen?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Ja, verwijderen' },
            { value: 'no', label: 'Nee, overblijft' },
          ]
        },
        {
          id: 'baseboard',
          label: 'Nieuwe plinten plaatsen?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Ja' },
            { value: 'no', label: 'Nee' },
          ]
        }
      ]
    },
    pricing: {
      basePrice: 45,
      unit: 'per m²',
      extras: {
        visgraat: 10,
        underfloorHeating: 5,
        removeOld: 15,
        baseboard: 8,
        pvc: -20, // PVC is goedkoper
      }
    }
  },
  
  schilderwerk: {
    id: 'schilderwerk',
    title: 'Schilderwerk Offerte',
    description: 'Direct een prijsindicatie en AI preview van uw geschilderde ruimte',
    icon: '🎨',
    photoPrompt: 'Upload foto\'s van de te schilderen ruimte',
    aiPrompt: 'Analyseer deze ruimte en genereer een preview met de muren geschilderd in {color}. Behoud alle details zoals meubels, ramen en deuren maar verander alleen de muurkleur.',
    fields: {
      materialOptions: [
        { value: 'latex', label: 'Latex (muurverf)' },
        { value: 'acryl', label: 'Acrylaat (buiten)' },
        { value: 'primer', label: 'Primer + Latex' },
      ],
      colorOptions: [
        { value: 'wit', label: 'Wit' },
        { value: 'gebroken-wit', label: 'Gebroken wit' },
        { value: 'grijs', label: 'Grijs' },
        { value: 'blauw', label: 'Blauw' },
        { value: 'groen', label: 'Groen' },
        { value: 'custom', label: 'Custom kleur (RAL)' },
      ],
      additionalQuestions: [
        {
          id: 'area',
          label: 'Oppervlakte muren (m²)',
          type: 'number',
        },
        {
          id: 'rooms',
          label: 'Aantal ruimtes',
          type: 'number',
        },
        {
          id: 'ceiling',
          label: 'Ook plafond schilderen?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Ja' },
            { value: 'no', label: 'Nee' },
          ]
        },
        {
          id: 'woodwork',
          label: 'Ook kozijnen/deuren schilderen?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Ja' },
            { value: 'no', label: 'Nee' },
          ]
        }
      ]
    },
    pricing: {
      basePrice: 12,
      unit: 'per m²',
      extras: {
        ceiling: 8,
        woodwork: 15,
        primer: 3,
      }
    }
  }
}

