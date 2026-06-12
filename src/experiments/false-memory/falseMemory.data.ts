import type { WordList, MisinformationScenario } from './falseMemory.types'

export const drmWordLists: WordList[] = [
  {
    id: 'sleep',
    theme: 'Sleep',
    lureWord: 'sleep',
    studyWords: [
      'bed', 'rest', 'awake', 'tired', 'dream', 'wake',
      'snooze', 'blanket', 'doze', 'slumber', 'nap', 'yawn',
    ],
    distractorWords: ['chair', 'pencil', 'window', 'clock'],
  },
  {
    id: 'doctor',
    theme: 'Doctor',
    lureWord: 'doctor',
    studyWords: [
      'nurse', 'sick', 'lawyer', 'medicine', 'health', 'hospital',
      'dentist', 'physician', 'ill', 'patient', 'office', 'stethoscope',
    ],
    distractorWords: ['teacher', 'garden', 'music', 'river'],
  },
  {
    id: 'mountain',
    theme: 'Mountain',
    lureWord: 'mountain',
    studyWords: [
      'hill', 'valley', 'climb', 'peak', 'goat', 'rocky',
      'steep', 'summit', 'snow', 'altitude', 'range', 'ridge',
    ],
    distractorWords: ['ocean', 'desert', 'airport', 'kitchen'],
  },
]

export const misinformationScenarios: MisinformationScenario[] = [
  {
    id: 'parking-lot-incident',
    title: 'The Parking Lot Incident',
    narrativeText:
      'It was a clear Tuesday afternoon in a busy shopping center parking lot. Maria had just finished her grocery run and was loading bags into the trunk of her red sedan. She eased out of her space cautiously, then came to a complete stop at the stop sign at the end of the row before pulling forward. While she paused at the sign, another car began backing out of a space further along the aisle. The driver, a woman in her forties, failed to check her mirrors, and her car drifted slowly into Maria\'s path. There was a soft collision as the reversing car\'s rear bumper made contact with the front passenger side of the red sedan. Both drivers stepped out to assess the minor damage. The afternoon light was good and witnesses were nearby. No one was injured, and both drivers exchanged insurance information calmly before going their separate ways.',
    misleadingQuestions: [
      {
        id: 'pli-q1',
        questionText: 'What traffic control sign did Maria stop at before pulling forward?',
        type: 'misleading',
        plantedDetail: 'yield sign',
        options: ['Stop sign', 'Yield sign', 'Speed limit sign', 'No parking sign'],
        correctAnswer: 'Stop sign',
        misleadingAnswer: 'Yield sign',
      },
      {
        id: 'pli-q2',
        questionText: "What colour was Maria's car?",
        type: 'misleading',
        plantedDetail: 'blue',
        options: ['Red', 'Blue', 'Silver', 'White'],
        correctAnswer: 'Red',
        misleadingAnswer: 'Blue',
      },
      {
        id: 'pli-q3',
        questionText: 'Who was driving the car that backed into Maria?',
        type: 'misleading',
        plantedDetail: 'a man in his fifties',
        options: ['A woman in her forties', 'A man in his fifties', 'A teenage boy', 'An elderly woman'],
        correctAnswer: 'A woman in her forties',
        misleadingAnswer: 'A man in his fifties',
      },
      {
        id: 'pli-q4',
        questionText: 'At approximately what speed was the other car moving when the collision occurred?',
        type: 'misleading',
        plantedDetail: '15 mph',
        options: ['Very slowly / almost stopped', '15 mph', '25 mph', '35 mph'],
        correctAnswer: 'Very slowly / almost stopped',
        misleadingAnswer: '15 mph',
      },
      {
        id: 'pli-q5',
        questionText: 'What type of vehicle was the other driver operating?',
        type: 'neutral',
        plantedDetail: null,
        options: ['White SUV', 'Black truck', 'Silver sedan', 'Blue minivan'],
        correctAnswer: 'White SUV',
        misleadingAnswer: 'Black truck',
      },
      {
        id: 'pli-q6',
        questionText: 'What time of day did the incident take place?',
        type: 'neutral',
        plantedDetail: null,
        options: ['Afternoon', 'Morning', 'Evening', 'Night'],
        correctAnswer: 'Afternoon',
        misleadingAnswer: 'Evening',
      },
    ],
    recognitionItems: [
      // From narrative
      { id: 'pli-r1', text: 'Red sedan', isFromNarrative: true, isPlanted: false, isDistractor: false },
      { id: 'pli-r2', text: 'Stop sign', isFromNarrative: true, isPlanted: false, isDistractor: false },
      { id: 'pli-r3', text: 'Insurance information', isFromNarrative: true, isPlanted: false, isDistractor: false },
      // Planted by misleading questions
      { id: 'pli-r4', text: 'Yield sign', isFromNarrative: false, isPlanted: true, isDistractor: false },
      { id: 'pli-r5', text: 'Blue car', isFromNarrative: false, isPlanted: true, isDistractor: false },
      { id: 'pli-r6', text: 'Male driver', isFromNarrative: false, isPlanted: true, isDistractor: false },
      // Distractors
      { id: 'pli-r7', text: 'Police officer', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'pli-r8', text: 'Broken headlight', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'pli-r9', text: 'Shopping cart', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'pli-r10', text: 'Rain', isFromNarrative: false, isPlanted: false, isDistractor: true },
    ],
  },
  {
    id: 'convenience-store',
    title: 'The Convenience Store',
    narrativeText:
      "On a busy Friday evening, James stopped at a small convenience store on his way home from work. The store was brightly lit with fluorescent lights that hummed faintly overhead. Near the entrance stood a rotating rack of magazines beside the front door. Behind the counter was a heavyset cashier with a thick beard, methodically scanning items for the customers ahead of James. A young child near the candy aisle tugged at her mother's sleeve, asking for a chocolate bar. When it was James's turn, he purchased a bottle of water and a pack of gum. He paid with cash, counting out the exact change from his wallet. The cashier thanked him without making much eye contact and placed the items in a small paper bag. James tucked the bag under his arm and pushed through the glass door back into the warm evening air.",
    misleadingQuestions: [
      {
        id: 'cs-q1',
        questionText: "How would you describe the cashier's facial hair?",
        type: 'misleading',
        plantedDetail: 'clean-shaven',
        options: ['Full beard', 'Clean-shaven', 'Goatee', 'Mustache only'],
        correctAnswer: 'Full beard',
        misleadingAnswer: 'Clean-shaven',
      },
      {
        id: 'cs-q2',
        questionText: 'What was positioned near the store entrance?',
        type: 'misleading',
        plantedDetail: 'a newspaper stand',
        options: ['A magazine rack', 'A newspaper stand', 'A candy display', 'A lottery ticket machine'],
        correctAnswer: 'A magazine rack',
        misleadingAnswer: 'A newspaper stand',
      },
      {
        id: 'cs-q3',
        questionText: 'How did James pay for his items?',
        type: 'misleading',
        plantedDetail: 'credit card',
        options: ['Cash', 'Credit card', 'Debit card', 'Mobile payment'],
        correctAnswer: 'Cash',
        misleadingAnswer: 'Credit card',
      },
      {
        id: 'cs-q4',
        questionText: 'Was there a security camera visible above the counter?',
        type: 'misleading',
        plantedDetail: 'yes, a dome camera',
        options: ['No camera was mentioned', 'Yes, a dome camera', 'Yes, a rectangular camera', 'There were two cameras'],
        correctAnswer: 'No camera was mentioned',
        misleadingAnswer: 'Yes, a dome camera',
      },
      {
        id: 'cs-q5',
        questionText: 'What type of lighting was in the store?',
        type: 'neutral',
        plantedDetail: null,
        options: ['Fluorescent lights', 'Neon signs', 'Dim lamps', 'Natural sunlight'],
        correctAnswer: 'Fluorescent lights',
        misleadingAnswer: 'Neon signs',
      },
      {
        id: 'cs-q6',
        questionText: 'What did the child ask for in the store?',
        type: 'neutral',
        plantedDetail: null,
        options: ['A chocolate bar', 'A soda', 'A toy', 'A bag of chips'],
        correctAnswer: 'A chocolate bar',
        misleadingAnswer: 'A soda',
      },
    ],
    recognitionItems: [
      // From narrative
      { id: 'cs-r1', text: 'Fluorescent lights', isFromNarrative: true, isPlanted: false, isDistractor: false },
      { id: 'cs-r2', text: 'Bearded cashier', isFromNarrative: true, isPlanted: false, isDistractor: false },
      { id: 'cs-r3', text: 'Magazine rack', isFromNarrative: true, isPlanted: false, isDistractor: false },
      // Planted by misleading questions
      { id: 'cs-r4', text: 'Clean-shaven cashier', isFromNarrative: false, isPlanted: true, isDistractor: false },
      { id: 'cs-r5', text: 'Newspaper stand', isFromNarrative: false, isPlanted: true, isDistractor: false },
      { id: 'cs-r6', text: 'Security camera', isFromNarrative: false, isPlanted: true, isDistractor: false },
      // Distractors
      { id: 'cs-r7', text: 'Broken refrigerator', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'cs-r8', text: 'Lottery tickets', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'cs-r9', text: 'Wet floor sign', isFromNarrative: false, isPlanted: false, isDistractor: true },
      { id: 'cs-r10', text: 'Outdoor seating', isFromNarrative: false, isPlanted: false, isDistractor: true },
    ],
  },
]

export function getRandomDRMSet(): WordList[] {
  const shuffled = [...drmWordLists]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

export function getRandomScenario(): MisinformationScenario {
  const index = Math.floor(Math.random() * misinformationScenarios.length)
  const scenario = misinformationScenarios[index]
  if (scenario === undefined) throw new Error('No misinformation scenarios available')
  return scenario
}
