import { MoodEntry, Activity } from '../types';

export const recentMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: '2023-11-15',
    rating: 4,
    note: 'Had a productive day at work and enjoyed dinner with friends.',
  },
  {
    id: '2',
    date: '2023-11-14',
    rating: 3,
    note: 'Feeling okay, but a bit tired from yesterday.',
  },
  {
    id: '3',
    date: '2023-11-13',
    rating: 5,
    note: 'Amazing day! Got a promotion at work.',
  },
  {
    id: '4',
    date: '2023-11-12',
    rating: 2,
    note: 'Feeling down today. Rainy weather and canceled plans.',
  },
  {
    id: '5',
    date: '2023-11-11',
    rating: 3,
    note: 'Average day, nothing special happened.',
  },
];

// Free version activities (23 total)
export const allActivities: Activity[] = [
  // Original activities
  {
    id: '1',
    title: '5-Minute Meditation',
    description: 'Take a short break to clear your mind and focus on your breathing.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e',
    tags: ['stress', 'anxiety', 'calm', 'focus', 'beginner']
  },
  {
    id: '2',
    title: 'Quick Stretching',
    description: 'Loosen up with some simple stretches to release tension.',
    duration: 10,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1',
    tags: ['energy', 'tension', 'physical', 'morning', 'beginner']
  },
  {
    id: '3',
    title: 'Gratitude Journaling',
    description: 'Write down three things you are grateful for today.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    tags: ['negative thoughts', 'perspective', 'reflection', 'sadness', 'intermediate']
  },
  {
    id: '4',
    title: 'Call a Friend',
    description: 'Reach out to someone you care about for a quick chat.',
    duration: 20,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8',
    tags: ['loneliness', 'connection', 'support', 'isolation', 'beginner']
  },
  {
    id: '5',
    title: 'Nature Walk',
    description: 'Take a walk outside and connect with nature.',
    duration: 30,
    category: 'exercise',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    tags: ['stress', 'fresh air', 'perspective', 'energy', 'beginner']
  },
  {
    id: '6',
    title: 'Deep Breathing',
    description: 'Practice deep breathing exercises to reduce stress and anxiety.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['anxiety', 'panic', 'stress', 'calm', 'beginner']
  },
  {
    id: '7',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and relax each muscle group to release physical tension.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    tags: ['tension', 'stress', 'physical', 'sleep', 'intermediate']
  },
  {
    id: '8',
    title: 'Listen to Uplifting Music',
    description: 'Play your favorite upbeat songs to boost your mood.',
    duration: 15,
    category: 'relaxation',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    tags: ['sadness', 'energy', 'motivation', 'joy', 'beginner']
  },
  {
    id: '9',
    title: 'Quick Workout',
    description: 'Do a short, high-intensity workout to get your blood pumping.',
    duration: 20,
    category: 'exercise',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    tags: ['energy', 'motivation', 'strength', 'focus', 'intermediate']
  },
  {
    id: '10',
    title: 'Creative Drawing',
    description: 'Express yourself through drawing or doodling without judgment.',
    duration: 25,
    category: 'creative',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    tags: ['expression', 'focus', 'creativity', 'stress', 'beginner']
  },
  {
    id: '11',
    title: 'Mindful Tea Ritual',
    description: 'Prepare and enjoy a cup of tea with full attention to the process.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574',
    tags: ['calm', 'ritual', 'focus', 'present', 'beginner']
  },
  {
    id: '12',
    title: 'Write a Letter',
    description: 'Write a letter to someone you appreciate (you don\'t have to send it).',
    duration: 20,
    category: 'creative',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1579208030886-b937da9f63a2',
    tags: ['gratitude', 'connection', 'expression', 'reflection', 'intermediate']
  },
  {
    id: '13',
    title: 'Digital Detox',
    description: 'Take a break from screens and digital devices for a set period.',
    duration: 60,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    tags: ['overwhelm', 'focus', 'present', 'stress', 'intermediate']
  },
  {
    id: '14',
    title: 'Declutter Space',
    description: 'Clear and organize a small area of your living or working space.',
    duration: 20,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1499955085172-a104c9463ece',
    tags: ['control', 'focus', 'accomplishment', 'overwhelm', 'beginner']
  },
  {
    id: '15',
    title: 'Positive Affirmations',
    description: 'Repeat positive statements about yourself and your capabilities.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0',
    tags: ['confidence', 'negative thoughts', 'self-esteem', 'anxiety', 'beginner']
  },
  
  // 8 Additional activities for free version
  {
    id: '16',
    title: 'Mindful Walking',
    description: 'Take a slow, deliberate walk while focusing on each step and your surroundings.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490',
    tags: ['stress', 'present', 'focus', 'nature', 'beginner']
  },
  {
    id: '17',
    title: 'Healthy Snack Break',
    description: 'Prepare and mindfully enjoy a nutritious snack to boost your energy and mood.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    tags: ['energy', 'nutrition', 'self-care', 'focus', 'beginner']
  },
  {
    id: '18',
    title: 'Power Nap',
    description: 'Take a short 10-20 minute nap to refresh your mind and boost alertness.',
    duration: 20,
    category: 'relaxation',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c',
    tags: ['tired', 'energy', 'rest', 'focus', 'beginner']
  },
  {
    id: '19',
    title: 'Random Act of Kindness',
    description: 'Do something nice for someone else without expecting anything in return.',
    duration: 15,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-b53601020a8f',
    tags: ['connection', 'purpose', 'joy', 'gratitude', 'beginner']
  },
  {
    id: '20',
    title: 'Dance Break',
    description: 'Put on your favorite song and dance freely for a few minutes.',
    duration: 5,
    category: 'exercise',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1545694693-b155c67c8091',
    tags: ['energy', 'joy', 'expression', 'movement', 'beginner']
  },
  {
    id: '21',
    title: 'Mindful Breathing',
    description: 'Focus on your breath for 5 minutes, counting each inhale and exhale.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['anxiety', 'stress', 'focus', 'calm', 'beginner']
  },
  {
    id: '22',
    title: 'Stretch Break',
    description: 'Take a short break to stretch your body, especially if you\'ve been sitting.',
    duration: 5,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0',
    tags: ['energy', 'physical', 'tension', 'focus', 'beginner']
  },
  {
    id: '23',
    title: 'Laugh Therapy',
    description: 'Watch a short funny video or read jokes to boost your mood with laughter.',
    duration: 10,
    category: 'relaxation',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1485178575877-1a9983c9addc',
    tags: ['joy', 'stress', 'mood', 'energy', 'beginner']
  }
];

// Premium version activities (additional 52 activities for a total of 75)
export const premiumActivities: Activity[] = [
  // All free activities
  ...allActivities,
  
  // Additional premium activities
  {
    id: '24',
    title: 'Body Scan Meditation',
    description: 'Progressively focus attention on different parts of your body to release tension.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['anxiety', 'stress', 'body', 'tension', 'intermediate']
  },
  {
    id: '25',
    title: 'Guided Visualization',
    description: 'Follow a guided imagery exercise to a peaceful place in your mind.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1476611338391-6f395a0dd82e',
    tags: ['stress', 'anxiety', 'imagination', 'calm', 'intermediate']
  },
  {
    id: '26',
    title: 'Yoga Sun Salutation',
    description: 'Flow through a sequence of yoga poses to energize your body and mind.',
    duration: 15,
    category: 'exercise',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    tags: ['energy', 'flow', 'strength', 'morning', 'intermediate']
  },
  {
    id: '27',
    title: 'Mindful Eating',
    description: 'Eat a meal or snack with full attention to the sensory experience.',
    duration: 20,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    tags: ['present', 'nutrition', 'awareness', 'habits', 'beginner']
  },
  {
    id: '28',
    title: 'Loving-Kindness Meditation',
    description: 'Practice sending well-wishes to yourself and others to cultivate compassion.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',
    tags: ['compassion', 'connection', 'kindness', 'anxiety', 'intermediate']
  },
  {
    id: '29',
    title: 'Expressive Writing',
    description: 'Write freely about your emotions and thoughts without judgment.',
    duration: 15,
    category: 'creative',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    tags: ['expression', 'processing', 'clarity', 'stress', 'beginner']
  },
  {
    id: '30',
    title: 'Mindful Photography',
    description: 'Take photos of things that catch your attention, focusing on details.',
    duration: 20,
    category: 'creative',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848',
    tags: ['present', 'creativity', 'perspective', 'focus', 'beginner']
  },
  {
    id: '31',
    title: 'Desk Yoga',
    description: 'Simple yoga poses you can do at your desk to relieve tension.',
    duration: 5,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1510531704581-5b2870972060',
    tags: ['work', 'tension', 'energy', 'focus', 'beginner']
  },
  {
    id: '32',
    title: 'Breathing Techniques',
    description: 'Learn different breathing patterns to manage stress and energy levels.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1474418397713-2f1091853e84',
    tags: ['anxiety', 'stress', 'energy', 'control', 'intermediate']
  },
  {
    id: '33',
    title: 'Mindful Listening',
    description: 'Listen to a song with complete attention to all the instruments and sounds.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    tags: ['present', 'focus', 'appreciation', 'calm', 'beginner']
  },
  {
    id: '34',
    title: 'Guided Relaxation',
    description: 'Follow a guided audio to progressively relax your entire body.',
    duration: 15,
    category: 'relaxation',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
    tags: ['stress', 'tension', 'sleep', 'anxiety', 'beginner']
  },
  {
    id: '35',
    title: 'Mindful Observation',
    description: 'Choose an object and observe it in detail for 5 minutes.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1495001258031-d1b407bc1776',
    tags: ['focus', 'present', 'awareness', 'calm', 'beginner']
  },
  {
    id: '36',
    title: 'Gratitude Visit',
    description: 'Write a letter of gratitude to someone and read it to them in person or by phone.',
    duration: 30,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    tags: ['gratitude', 'connection', 'joy', 'purpose', 'intermediate']
  },
  {
    id: '37',
    title: 'Mindful Walking Meditation',
    description: 'Walk slowly and deliberately, focusing on each sensation of movement.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8',
    tags: ['focus', 'present', 'movement', 'stress', 'intermediate']
  },
  {
    id: '38',
    title: 'Visualization Exercise',
    description: 'Visualize yourself successfully handling a challenging situation.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1486929528246-9b7097d8eb59',
    tags: ['confidence', 'preparation', 'anxiety', 'focus', 'intermediate']
  },
  {
    id: '39',
    title: 'Mindful Cooking',
    description: 'Prepare a simple dish with full attention to the process and sensations.',
    duration: 30,
    category: 'creative',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    tags: ['present', 'creativity', 'nourishment', 'focus', 'intermediate']
  },
  {
    id: '40',
    title: 'Thought Defusion',
    description: 'Practice observing your thoughts without getting caught up in them.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1536746803623-cef87080bfc8',
    tags: ['anxiety', 'rumination', 'perspective', 'awareness', 'intermediate']
  },
  {
    id: '41',
    title: 'Self-Compassion Break',
    description: 'Practice a brief self-compassion exercise when facing difficulty.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    tags: ['self-care', 'kindness', 'stress', 'emotions', 'beginner']
  },
  {
    id: '42',
    title: 'Mindful Gardening',
    description: 'Tend to plants with full attention to the sensory experience.',
    duration: 20,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
    tags: ['nature', 'nurturing', 'present', 'calm', 'beginner']
  },
  {
    id: '43',
    title: 'Mindful Showering',
    description: 'Take a shower with full attention to the sensations of water and temperature.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
    tags: ['present', 'sensory', 'refresh', 'routine', 'beginner']
  },
  {
    id: '44',
    title: 'Mindful Technology Use',
    description: 'Set intentions for how you\'ll use technology in the next hour.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    tags: ['focus', 'boundaries', 'awareness', 'productivity', 'beginner']
  },
  {
    id: '45',
    title: 'Mindful Cleaning',
    description: 'Clean a small area with full attention to the process and result.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473',
    tags: ['accomplishment', 'order', 'focus', 'present', 'beginner']
  },
  {
    id: '46',
    title: 'Mindful Commuting',
    description: 'Use your commute time to practice mindfulness instead of autopilot.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e',
    tags: ['routine', 'awareness', 'transition', 'present', 'beginner']
  },
  {
    id: '47',
    title: 'Mindful Waiting',
    description: 'Use waiting time as an opportunity to practice mindfulness.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
    tags: ['patience', 'present', 'awareness', 'calm', 'beginner']
  },
  {
    id: '48',
    title: 'Mindful Social Media',
    description: 'Set a timer and use social media with intention and awareness.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    tags: ['boundaries', 'awareness', 'connection', 'focus', 'beginner']
  },
  {
    id: '49',
    title: 'Mindful Posture Check',
    description: 'Take a moment to notice and adjust your posture for comfort and alignment.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    tags: ['body', 'awareness', 'comfort', 'energy', 'beginner']
  },
  {
    id: '50',
    title: 'Mindful Hand Washing',
    description: 'Wash your hands with full attention to the sensations and movements.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'low',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982',
    tags: ['routine', 'present', 'sensory', 'hygiene', 'beginner']
  },
  {
    id: '51',
    title: 'Mindful Eating Challenge',
    description: 'Eat one meal a day mindfully for a week, noting the differences.',
    duration: 20,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d',
    tags: ['habit', 'awareness', 'nutrition', 'present', 'intermediate']
  },
  {
    id: '52',
    title: 'Mindful Breathing Timer',
    description: 'Set a timer to remind you to take mindful breaths throughout the day.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['habit', 'awareness', 'stress', 'routine', 'beginner']
  },
  {
    id: '53',
    title: 'Mindful Goal Setting',
    description: 'Set intentions for your day or week with mindful awareness.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
    tags: ['purpose', 'planning', 'focus', 'motivation', 'intermediate']
  },
  {
    id: '54',
    title: 'Mindful Journaling',
    description: 'Write about your experiences with a focus on sensations and observations.',
    duration: 15,
    category: 'creative',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    tags: ['reflection', 'awareness', 'processing', 'clarity', 'intermediate']
  },
  {
    id: '55',
    title: 'Mindful Reading',
    description: 'Read a book or article with full attention, noticing when your mind wanders.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1488868935619-4483ed49a3a7',
    tags: ['focus', 'learning', 'present', 'calm', 'beginner']
  },
  {
    id: '56',
    title: 'Mindful Listening to Others',
    description: 'Practice truly listening to someone without planning your response.',
    duration: 15,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8',
    tags: ['connection', 'empathy', 'present', 'relationships', 'intermediate']
  },
  {
    id: '57',
    title: 'Mindful Appreciation',
    description: 'Notice five things you typically take for granted and appreciate them.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['gratitude', 'awareness', 'perspective', 'joy', 'beginner']
  },
  {
    id: '58',
    title: 'Mindful Transitions',
    description: 'Practice mindfulness during transitions between activities in your day.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['awareness', 'focus', 'present', 'routine', 'beginner']
  },
  {
    id: '59',
    title: 'Mindful Check-In',
    description: 'Take a moment to check in with your body, emotions, and thoughts.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['awareness', 'emotions', 'body', 'present', 'beginner']
  },
  {
    id: '60',
    title: 'Mindful Movement',
    description: 'Move your body slowly and deliberately, noticing all sensations.',
    duration: 10,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    tags: ['body', 'awareness', 'present', 'energy', 'beginner']
  },
  {
    id: '61',
    title: 'Mindful Driving',
    description: 'Drive with full attention to the road, your body, and your surroundings.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    tags: ['focus', 'safety', 'present', 'awareness', 'intermediate']
  },
  {
    id: '62',
    title: 'Mindful Conversation',
    description: 'Have a conversation with full presence and attention to the other person.',
    duration: 15,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8',
    tags: ['connection', 'present', 'listening', 'relationships', 'intermediate']
  },
  {
    id: '63',
    title: 'Mindful Gratitude List',
    description: 'Write down 10 things you\'re grateful for with full attention to each.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    tags: ['gratitude', 'perspective', 'joy', 'reflection', 'beginner']
  },
  {
    id: '64',
    title: 'Mindful Nature Connection',
    description: 'Spend time in nature, noticing details with all your senses.',
    duration: 20,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    tags: ['nature', 'sensory', 'present', 'calm', 'beginner']
  },
  {
    id: '65',
    title: 'Mindful Body Scan',
    description: 'Scan your body from head to toe, noticing sensations without judgment.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['body', 'awareness', 'tension', 'relaxation', 'intermediate']
  },
  {
    id: '66',
    title: 'Mindful Breathing Space',
    description: 'Take a 3-minute breathing space to center yourself during a busy day.',
    duration: 3,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['stress', 'centering', 'quick', 'awareness', 'beginner']
  },
  {
    id: '67',
    title: 'Mindful Stretching',
    description: 'Stretch your body with full attention to the sensations and limits.',
    duration: 10,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1',
    tags: ['body', 'tension', 'awareness', 'energy', 'beginner']
  },
  {
    id: '68',
    title: 'Mindful Breathing Patterns',
    description: 'Practice different breathing patterns to regulate your nervous system.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['anxiety', 'stress', 'regulation', 'calm', 'intermediate']
  },
  {
    id: '69',
    title: 'Mindful Self-Compassion',
    description: 'Practice treating yourself with the same kindness you\'d offer a good friend.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['self-care', 'kindness', 'emotions', 'stress', 'intermediate']
  },
  {
    id: '70',
    title: 'Mindful Acceptance',
    description: 'Practice accepting difficult emotions or situations without resistance.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['emotions', 'acceptance', 'resilience', 'stress', 'advanced']
  },
  {
    id: '71',
    title: 'Mindful Values Reflection',
    description: 'Reflect on your core values and how they guide your actions.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    tags: ['purpose', 'meaning', 'reflection', 'clarity', 'intermediate']
  },
  {
    id: '72',
    title: 'Mindful Forgiveness Practice',
    description: 'Practice forgiveness toward yourself or others with mindful awareness.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['forgiveness', 'letting go', 'emotions', 'relationships', 'advanced']
  },
  {
    id: '73',
    title: 'Mindful Intention Setting',
    description: 'Set a clear intention for your day or for a specific activity.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['purpose', 'focus', 'motivation', 'clarity', 'beginner']
  },
  {
    id: '74',
    title: 'Mindful Digital Boundaries',
    description: 'Set and maintain healthy boundaries with technology and social media.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    tags: ['boundaries', 'focus', 'wellbeing', 'stress', 'intermediate']
  },
  {
    id: '75',
    title: 'Mindful Reflection',
    description: 'Reflect on your day with mindful awareness and without judgment.',
    duration: 10,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    tags: ['reflection', 'learning', 'awareness', 'growth', 'intermediate']
  }
];

// Default recommended activities (first 3)
export const recommendedActivities: Activity[] = allActivities.slice(0, 3);