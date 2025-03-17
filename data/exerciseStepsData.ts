import { ExerciseStep } from '../types';

// Define the exercise content with step-by-step instructions for each exercise
export const exerciseContent: Record<string, ExerciseStep[]> = {
  // Default exercise steps (used as fallback)
  default: [
    {
      title: "Preparation",
      instruction: "Find a comfortable position. You can sit in a chair or on the floor. Keep your back straight but not stiff.",
      duration: 30
    },
    {
      title: "Focus on your breath",
      instruction: "Close your eyes and begin to notice your breath. Don't try to change it, just observe the natural rhythm.",
      duration: 60
    },
    {
      title: "Deepen your awareness",
      instruction: "As you continue breathing, bring your attention to the sensations in your body. Notice any areas of tension or comfort.",
      duration: 90
    },
    {
      title: "Complete the practice",
      instruction: "Gently bring your awareness back to your surroundings. When you're ready, slowly open your eyes.",
      duration: 30
    }
  ],

  // Meditation exercises
  "1": [ // Calm Mind Meditation
    {
      title: "Find a comfortable position",
      instruction: "Sit in a comfortable position with your back straight. Place your hands on your lap or knees.",
      duration: 60
    },
    {
      title: "Close your eyes",
      instruction: "Gently close your eyes and take a few deep breaths. Allow your body to relax with each exhale.",
      duration: 60
    },
    {
      title: "Focus on your breath",
      instruction: "Bring your attention to your breath. Notice the sensation of air flowing in and out of your nostrils.",
      duration: 120
    },
    {
      title: "Notice your thoughts",
      instruction: "As thoughts arise, acknowledge them without judgment, then gently return your focus to your breath.",
      duration: 180
    },
    {
      title: "Body scan",
      instruction: "Bring awareness to your body. Notice any areas of tension and allow them to soften with each breath.",
      duration: 120
    },
    {
      title: "Return to breath",
      instruction: "Return your focus to your breath. Feel the rhythm of your breathing, the rise and fall of your chest.",
      duration: 60
    },
    {
      title: "Closing",
      instruction: "Slowly bring your awareness back to your surroundings. When you're ready, gently open your eyes.",
      duration: 60
    }
  ],
  
  "4": [ // Joy Visualization
    {
      title: "Comfortable position",
      instruction: "Find a comfortable seated position. Rest your hands on your lap with palms facing up.",
      duration: 60
    },
    {
      title: "Deep breathing",
      instruction: "Take three deep breaths, inhaling through your nose and exhaling through your mouth.",
      duration: 45
    },
    {
      title: "Recall a joyful moment",
      instruction: "Think of a time when you felt pure joy. Recall the details - where you were, who was there, what happened.",
      duration: 90
    },
    {
      title: "Engage your senses",
      instruction: "Immerse yourself in this memory. What did you see? What sounds did you hear? What did you feel?",
      duration: 120
    },
    {
      title: "Notice physical sensations",
      instruction: "Pay attention to how joy feels in your body. Perhaps warmth in your chest, lightness, or a smile on your face.",
      duration: 90
    },
    {
      title: "Expand the feeling",
      instruction: "Imagine this joy expanding with each breath, filling your entire body from head to toe.",
      duration: 120
    },
    {
      title: "Set an intention",
      instruction: "Set an intention to carry this feeling of joy with you throughout your day.",
      duration: 60
    },
    {
      title: "Gentle return",
      instruction: "Slowly bring your awareness back to the present moment. When ready, gently open your eyes.",
      duration: 45
    }
  ],
  
  "8": [ // Morning Meditation
    {
      title: "Find your seat",
      instruction: "Sit comfortably with your spine straight. Rest your hands on your thighs or in your lap.",
      duration: 45
    },
    {
      title: "Connect with your breath",
      instruction: "Close your eyes and take three deep breaths, feeling your abdomen expand and contract.",
      duration: 45
    },
    {
      title: "Set your intention",
      instruction: "Consider what you want to bring into your day. Perhaps clarity, patience, or joy.",
      duration: 60
    },
    {
      title: "Body awareness",
      instruction: "Scan your body from head to toe, noticing any sensations without trying to change them.",
      duration: 90
    },
    {
      title: "Breath counting",
      instruction: "Count your breaths from 1 to 10, then start again. If your mind wanders, gently return to counting.",
      duration: 120
    },
    {
      title: "Visualize your day",
      instruction: "Imagine your day unfolding with ease. See yourself responding to challenges with calm and clarity.",
      duration: 90
    },
    {
      title: "Gratitude moment",
      instruction: "Bring to mind three things you're grateful for today, no matter how small.",
      duration: 60
    },
    {
      title: "Closing",
      instruction: "Take a deep breath and set the intention to carry this peaceful energy throughout your day.",
      duration: 60
    }
  ],
  
  "12": [ // Loving Kindness Meditation
    {
      title: "Comfortable posture",
      instruction: "Find a comfortable seated position. Allow your body to feel relaxed yet alert.",
      duration: 45
    },
    {
      title: "Connect with your heart",
      instruction: "Place your hands over your heart center. Take a few deep breaths, feeling your chest rise and fall.",
      duration: 45
    },
    {
      title: "Self-compassion",
      instruction: "Silently repeat: 'May I be happy. May I be healthy. May I be safe. May I live with ease.'",
      duration: 90
    },
    {
      title: "Visualize loving energy",
      instruction: "Imagine a warm, glowing light in your heart center, radiating love and kindness throughout your body.",
      duration: 60
    },
    {
      title: "Extend to a loved one",
      instruction: "Bring to mind someone you care deeply about. Repeat: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'",
      duration: 90
    },
    {
      title: "Extend to a neutral person",
      instruction: "Think of someone you neither like nor dislike. Offer them the same wishes of loving kindness.",
      duration: 90
    },
    {
      title: "Extend to a difficult person",
      instruction: "Think of someone with whom you have difficulty. As best you can, offer them these same wishes.",
      duration: 90
    },
    {
      title: "Extend to all beings",
      instruction: "Expand your awareness to include all beings everywhere. 'May all beings be happy, healthy, safe, and live with ease.'",
      duration: 60
    },
    {
      title: "Return to center",
      instruction: "Bring your awareness back to your heart center. Notice how you feel after practicing loving kindness.",
      duration: 60
    }
  ],
  
  "13": [ // Body Scan Meditation
    {
      title: "Lie down comfortably",
      instruction: "Lie on your back with your arms at your sides, palms facing up. Close your eyes.",
      duration: 45
    },
    {
      title: "Initial breath awareness",
      instruction: "Take a few deep breaths, allowing your body to settle into the surface beneath you.",
      duration: 45
    },
    {
      title: "Scan your feet and legs",
      instruction: "Bring your awareness to your toes, feet, and ankles. Notice any sensations without judgment. Then move to your calves, knees, and thighs.",
      duration: 120
    },
    {
      title: "Scan your pelvis and abdomen",
      instruction: "Move your attention to your pelvis, hips, and lower back. Then to your abdomen, noticing the gentle movement of your breath.",
      duration: 90
    },
    {
      title: "Scan your chest and upper back",
      instruction: "Bring awareness to your chest, upper back, and shoulders. Notice any tension and allow it to soften.",
      duration: 90
    },
    {
      title: "Scan your arms and hands",
      instruction: "Move your attention down your arms to your hands and fingers. Notice any tingling, temperature, or other sensations.",
      duration: 90
    },
    {
      title: "Scan your neck and head",
      instruction: "Bring awareness to your neck, jaw, face, and scalp. Allow any tension to release with each exhale.",
      duration: 90
    },
    {
      title: "Whole body awareness",
      instruction: "Expand your awareness to include your entire body as a whole. Feel the boundary between your body and the space around it.",
      duration: 90
    },
    {
      title: "Closing",
      instruction: "Slowly wiggle your fingers and toes. Take a deep breath and when you're ready, gently open your eyes.",
      duration: 60
    }
  ],
  
  "14": [ // Mindful Awareness Meditation
    {
      title: "Seated position",
      instruction: "Sit comfortably with your back straight but not rigid. Rest your hands wherever they feel natural.",
      duration: 45
    },
    {
      title: "Establish awareness",
      instruction: "Close your eyes and take a moment to notice how you feel right now, without trying to change anything.",
      duration: 60
    },
    {
      title: "Anchor to breath",
      instruction: "Bring your attention to your breath. Notice where you feel it most prominently - perhaps at the nostrils, chest, or abdomen.",
      duration: 90
    },
    {
      title: "Note the present moment",
      instruction: "As you breathe, silently note 'in' as you inhale and 'out' as you exhale. This helps anchor your awareness to the present.",
      duration: 120
    },
    {
      title: "Acknowledge wandering mind",
      instruction: "When you notice your mind has wandered, gently acknowledge it by noting 'thinking' and return to the breath.",
      duration: 90
    },
    {
      title: "Expand awareness",
      instruction: "Widen your attention to include sounds around you. Notice them come and go without getting caught up in them.",
      duration: 60
    },
    {
      title: "Include bodily sensations",
      instruction: "Expand your awareness further to include physical sensations. Notice areas of comfort or discomfort without judgment.",
      duration: 60
    },
    {
      title: "Open awareness",
      instruction: "Allow your awareness to be open to whatever arises - thoughts, feelings, sensations - without following or resisting them.",
      duration: 90
    },
    {
      title: "Gentle conclusion",
      instruction: "Gradually bring your attention back to your breath. When you're ready, slowly open your eyes.",
      duration: 45
    }
  ],
  
  // Breathing exercises
  "2": [ // Energizing Breath Work
    {
      title: "Preparation",
      instruction: "Sit comfortably with your spine straight. Rest your hands on your knees with palms facing up.",
      duration: 30
    },
    {
      title: "Deep belly breathing",
      instruction: "Place one hand on your belly. Inhale deeply through your nose, feeling your belly expand. Exhale fully through your mouth.",
      duration: 60
    },
    {
      title: "Energizing breath",
      instruction: "Inhale quickly through your nose, then exhale forcefully through your mouth making a 'ha' sound. Repeat 10 times.",
      duration: 60
    },
    {
      title: "Breath of fire",
      instruction: "Begin rapid, rhythmic breathing through your nose with equal emphasis on inhale and exhale. Keep your mouth closed. Continue for 30 seconds.",
      duration: 45
    },
    {
      title: "Rest and observe",
      instruction: "Return to normal breathing. Close your eyes and notice the sensations in your body and the quality of your energy.",
      duration: 30
    },
    {
      title: "Second round",
      instruction: "Repeat the breath of fire for another 30 seconds, keeping the pace steady and rhythmic.",
      duration: 45
    },
    {
      title: "Final integration",
      instruction: "Take three deep breaths. On the exhale, imagine sending energy throughout your entire body.",
      duration: 30
    }
  ],
  
  "7": [ // Deep Breathing Technique
    {
      title: "Find your position",
      instruction: "Sit or lie down comfortably. Place one hand on your chest and the other on your abdomen.",
      duration: 30
    },
    {
      title: "Observe natural breath",
      instruction: "Take a moment to notice your natural breathing pattern without changing it.",
      duration: 45
    },
    {
      title: "Diaphragmatic breathing",
      instruction: "Inhale slowly through your nose, feeling your abdomen rise. The hand on your chest should remain relatively still.",
      duration: 60
    },
    {
      title: "Complete exhale",
      instruction: "Exhale fully through your mouth, feeling your abdomen fall. Gently contract your abdominal muscles to expel all the air.",
      duration: 60
    },
    {
      title: "Establish rhythm",
      instruction: "Continue this deep breathing pattern. Inhale for a count of 4, exhale for a count of 6.",
      duration: 90
    },
    {
      title: "Focus on relaxation",
      instruction: "With each exhale, imagine releasing tension from your body. Feel yourself becoming more relaxed with each breath.",
      duration: 60
    },
    {
      title: "Deepen the breath",
      instruction: "Now inhale for a count of 5, hold for 2, and exhale for a count of 7. Continue this pattern.",
      duration: 90
    },
    {
      title: "Return to natural breath",
      instruction: "Gradually return to your natural breathing pattern. Notice how your body feels now compared to when you started.",
      duration: 45
    }
  ],
  
  "11": [ // Box Breathing
    {
      title: "Comfortable position",
      instruction: "Sit with your back straight and shoulders relaxed. Rest your hands on your lap.",
      duration: 30
    },
    {
      title: "Initial deep breaths",
      instruction: "Take three deep breaths to prepare. Inhale through your nose and exhale through your mouth.",
      duration: 45
    },
    {
      title: "Begin box breathing",
      instruction: "Inhale through your nose for a count of 4, filling your lungs completely.",
      duration: 30
    },
    {
      title: "First hold",
      instruction: "Hold your breath for a count of 4. Maintain a relaxed posture.",
      duration: 30
    },
    {
      title: "Exhale",
      instruction: "Exhale completely through your mouth for a count of 4, emptying your lungs fully.",
      duration: 30
    },
    {
      title: "Second hold",
      instruction: "Hold your breath again for a count of 4 before beginning the next cycle.",
      duration: 30
    },
    {
      title: "Continue the pattern",
      instruction: "Repeat this box breathing pattern: inhale for 4, hold for 4, exhale for 4, hold for 4.",
      duration: 120
    },
    {
      title: "Mindful awareness",
      instruction: "As you continue, notice how your body and mind respond to this regulated breathing pattern.",
      duration: 60
    },
    {
      title: "Closing",
      instruction: "Gradually return to your natural breathing pattern. Notice the sense of calm in your body and mind.",
      duration: 45
    }
  ],
  
  "15": [ // 4-7-8 Breathing
    {
      title: "Comfortable position",
      instruction: "Sit comfortably with your back straight. Rest the tip of your tongue against the roof of your mouth, just behind your upper front teeth.",
      duration: 45
    },
    {
      title: "Initial exhale",
      instruction: "Exhale completely through your mouth, making a whoosh sound.",
      duration: 30
    },
    {
      title: "4-count inhale",
      instruction: "Close your mouth and inhale quietly through your nose to a mental count of 4.",
      duration: 30
    },
    {
      title: "7-count hold",
      instruction: "Hold your breath for a count of 7. Maintain a relaxed posture.",
      duration: 45
    },
    {
      title: "8-count exhale",
      instruction: "Exhale completely through your mouth, making a whoosh sound to a count of 8.",
      duration: 45
    },
    {
      title: "Complete first cycle",
      instruction: "This completes one breath cycle. Now let's repeat this pattern three more times.",
      duration: 30
    },
    {
      title: "Continue practice",
      instruction: "Continue the 4-7-8 pattern: inhale for 4, hold for 7, exhale for 8. Notice the calming effect with each cycle.",
      duration: 180
    },
    {
      title: "Deepen the practice",
      instruction: "As you continue, allow your body to relax more deeply with each exhale. Feel tension dissolving.",
      duration: 90
    },
    {
      title: "Final cycles",
      instruction: "Complete two more cycles at your own pace, maintaining the 4-7-8 ratio.",
      duration: 90
    },
    {
      title: "Closing",
      instruction: "Return to normal breathing. Notice how your body and mind feel compared to when you started.",
      duration: 45
    }
  ],
  
  "16": [ // Alternate Nostril Breathing
    {
      title: "Seated position",
      instruction: "Sit comfortably with your spine straight. Rest your left hand on your left knee.",
      duration: 30
    },
    {
      title: "Hand position",
      instruction: "Raise your right hand to your face. Fold your index and middle fingers toward your palm, keeping your thumb, ring finger, and pinky extended.",
      duration: 45
    },
    {
      title: "Close right nostril",
      instruction: "Use your right thumb to gently close your right nostril. Inhale slowly through your left nostril.",
      duration: 30
    },
    {
      title: "Switch nostrils",
      instruction: "At the top of your inhale, close your left nostril with your ring finger, release your thumb, and exhale through your right nostril.",
      duration: 30
    },
    {
      title: "Continue pattern",
      instruction: "Inhale through your right nostril. Then close the right nostril, open the left, and exhale through the left nostril.",
      duration: 30
    },
    {
      title: "Establish rhythm",
      instruction: "Continue this alternating pattern. Inhale through one nostril, exhale through the other. Keep your breath smooth and even.",
      duration: 120
    },
    {
      title: "Deepen the practice",
      instruction: "As you continue, lengthen your inhales and exhales. Notice the calming effect on your nervous system.",
      duration: 90
    },
    {
      title: "Energy balancing",
      instruction: "This practice balances the left and right hemispheres of your brain. Feel the harmonizing effect throughout your body.",
      duration: 60
    },
    {
      title: "Final cycles",
      instruction: "Complete three more full cycles at your own pace.",
      duration: 90
    },
    {
      title: "Return to normal breathing",
      instruction: "Lower your hand and return to breathing through both nostrils. Notice how you feel - perhaps more balanced and centered.",
      duration: 45
    }
  ],
  
  "17": [ // Breath of Fire
    {
      title: "Seated position",
      instruction: "Sit comfortably with your spine straight. Rest your hands on your knees with palms facing up.",
      duration: 30
    },
    {
      title: "Understand the technique",
      instruction: "Breath of Fire involves rapid, rhythmic breathing with equal emphasis on inhale and exhale, powered by your abdomen.",
      duration: 45
    },
    {
      title: "Practice the exhale",
      instruction: "Place your hands on your abdomen. Practice a sharp exhale through your nose, feeling your navel pull in toward your spine.",
      duration: 45
    },
    {
      title: "Add the inhale",
      instruction: "Allow your inhale to happen passively as your abdomen relaxes after the exhale. The inhale should be equal in length to the exhale.",
      duration: 45
    },
    {
      title: "Begin slowly",
      instruction: "Start with a slow rhythm, about one breath per second. Keep your mouth closed, breathing only through your nose.",
      duration: 60
    },
    {
      title: "First round",
      instruction: "Continue Breath of Fire for 30 seconds at this pace. If you feel lightheaded, return to normal breathing.",
      duration: 45
    },
    {
      title: "Rest",
      instruction: "Return to normal breathing. Notice the sensations in your body - perhaps tingling, warmth, or increased energy.",
      duration: 30
    },
    {
      title: "Second round",
      instruction: "Begin Breath of Fire again, slightly faster if comfortable. Continue for 45 seconds.",
      duration: 60
    },
    {
      title: "Final rest",
      instruction: "Return to normal breathing. Close your eyes and feel the energy circulating throughout your body.",
      duration: 45
    },
    {
      title: "Integration",
      instruction: "Take three deep breaths. Notice how alert and energized you feel compared to when you started.",
      duration: 45
    }
  ],
  
  // Mindfulness exercises
  "3": [ // Gratitude Practice
    {
      title: "Centering",
      instruction: "Find a comfortable seated position. Close your eyes and take three deep breaths.",
      duration: 45
    },
    {
      title: "Reflect on nature",
      instruction: "Think of something in nature you're grateful for - perhaps the sun, trees, or the ocean. Feel appreciation for its presence in your life.",
      duration: 60
    },
    {
      title: "Appreciate relationships",
      instruction: "Bring to mind someone who has positively impacted your life. Feel gratitude for their presence and support.",
      duration: 60
    },
    {
      title: "Acknowledge personal qualities",
      instruction: "Consider a quality or ability you possess that you're thankful for. Perhaps your resilience, creativity, or compassion.",
      duration: 60
    },
    {
      title: "Recognize simple pleasures",
      instruction: "Think of a simple pleasure you experienced recently - a delicious meal, a moment of laughter, or a good night's sleep.",
      duration: 60
    },
    {
      title: "Feel gratitude in your body",
      instruction: "Notice how gratitude feels in your body. Perhaps warmth in your chest, relaxation in your shoulders, or a smile on your face.",
      duration: 45
    },
    {
      title: "Set an intention",
      instruction: "Set an intention to notice moments of gratitude throughout your day, even in small or challenging situations.",
      duration: 45
    },
    {
      title: "Closing reflection",
      instruction: "Take a final deep breath, carrying this feeling of appreciation with you as you slowly open your eyes.",
      duration: 45
    }
  ],
  
  "5": [ // Stress Release Body Scan
    {
      title: "Comfortable position",
      instruction: "Lie down or sit comfortably. Close your eyes and take three deep breaths.",
      duration: 45
    },
    {
      title: "Awareness of feet and legs",
      instruction: "Bring your attention to your feet. Notice any tension and imagine it dissolving with each exhale. Move up to your calves, knees, and thighs.",
      duration: 90
    },
    {
      title: "Tension release in hips",
      instruction: "Focus on your hips and pelvic area. These areas often hold stress. Imagine any tension melting away as you breathe deeply.",
      duration: 60
    },
    {
      title: "Abdomen and chest",
      instruction: "Bring awareness to your abdomen. Notice the gentle movement with your breath. Then move to your chest, allowing it to soften.",
      duration: 60
    },
    {
      title: "Back release",
      instruction: "Focus on your back, from lower to upper. Imagine each vertebra releasing and relaxing with your breath.",
      duration: 90
    },
    {
      title: "Shoulders and neck",
      instruction: "These areas often hold significant tension. Bring gentle awareness here, allowing your shoulders to drop away from your ears.",
      duration: 90
    },
    {
      title: "Facial relaxation",
      instruction: "Scan your jaw, eyes, forehead, and scalp. Allow any holding or tension to soften and release.",
      duration: 60
    },
    {
      title: "Whole body awareness",
      instruction: "Expand your awareness to your entire body. Feel it becoming heavier and more relaxed with each breath.",
      duration: 60
    },
    {
      title: "Stress visualization",
      instruction: "Imagine any remaining stress as a color or mist leaving your body with each exhale, dissolving into the air around you.",
      duration: 60
    },
    {
      title: "Completion",
      instruction: "Slowly wiggle your fingers and toes. Take a deep breath and, when ready, gently open your eyes.",
      duration: 45
    }
  ],
  
  "9": [ // Body Awareness Scan
    {
      title: "Comfortable position",
      instruction: "Lie down comfortably with your arms at your sides. Close your eyes and take three deep breaths.",
      duration: 45
    },
    {
      title: "Grounding",
      instruction: "Feel the points of contact between your body and the surface beneath you. Notice the support it provides.",
      duration: 45
    },
    {
      title: "Feet and legs awareness",
      instruction: "Bring your attention to your feet. Notice sensations - temperature, pressure, tingling. Then move to your legs.",
      duration: 90
    },
    {
      title: "Pelvis and lower back",
      instruction: "Scan your pelvis, hips, and lower back. Notice any sensations without trying to change them.",
      duration: 60
    },
    {
      title: "Abdomen awareness",
      instruction: "Focus on your abdomen. Feel it rise and fall with each breath. Notice any other sensations in this area.",
      duration: 60
    },
    {
      title: "Chest and upper back",
      instruction: "Bring awareness to your chest, upper back, and shoulders. Notice the movement of your breath here.",
      duration: 60
    },
    {
      title: "Arms and hands",
      instruction: "Scan down your arms to your hands and fingers. Notice any sensations - perhaps heaviness, lightness, or tingling.",
      duration: 60
    },
    {
      title: "Neck and head",
      instruction: "Bring attention to your neck, face, and scalp. Notice sensations without judgment.",
      duration: 60
    },
    {
      title: "Whole body awareness",
      instruction: "Expand your awareness to include your entire body as a unified whole. Feel the life energy throughout.",
      duration: 90
    },
    {
      title: "Breath and body connection",
      instruction: "Notice how your breath moves through your body, bringing oxygen and energy to every cell.",
      duration: 60
    },
    {
      title: "Completion",
      instruction: "Slowly begin to deepen your breath. When ready, gently wiggle your fingers and toes, and open your eyes.",
      duration: 60
    }
  ],
  
  "18": [ // Mindful Eating Practice
    {
      title: "Preparation",
      instruction: "Choose a small piece of food like a raisin, nut, or berry. Place it in front of you.",
      duration: 30
    },
    {
      title: "Observe",
      instruction: "Look at the food as if you've never seen it before. Notice its color, texture, shape, and size.",
      duration: 45
    },
    {
      title: "Touch",
      instruction: "Pick up the food and feel its texture between your fingers. Is it smooth, rough, soft, or firm?",
      duration: 45
    },
    {
      title: "Smell",
      instruction: "Bring the food to your nose and inhale its aroma. Notice any thoughts or sensations that arise.",
      duration: 45
    },
    {
      title: "Place in mouth",
      instruction: "Place the food in your mouth but don't chew yet. Notice the sensation of having it on your tongue.",
      duration: 30
    },
    {
      title: "Taste",
      instruction: "Begin to chew slowly, noticing the flavors and textures. Is it sweet, salty, bitter, or sour?",
      duration: 45
    },
    {
      title: "Swallow",
      instruction: "Notice the intention to swallow, then follow the sensation as the food travels down your throat.",
      duration: 30
    },
    {
      title: "After-effects",
      instruction: "Notice any lingering tastes or sensations. Be aware of how your body feels after eating.",
      duration: 45
    },
    {
      title: "Reflection",
      instruction: "Reflect on this experience. How was it different from your usual way of eating?",
      duration: 45
    },
    {
      title: "Closing",
      instruction: "Consider how you might bring this mindful awareness to other meals throughout your day.",
      duration: 30
    }
  ],
  
  "19": [ // Mindful Walking
    {
      title: "Preparation",
      instruction: "Find a space where you can walk slowly for about 10-15 steps in one direction. Stand at one end.",
      duration: 30
    },
    {
      title: "Grounding",
      instruction: "Stand still for a moment. Feel your feet making contact with the ground. Notice your weight distribution.",
      duration: 45
    },
    {
      title: "Intention",
      instruction: "Set an intention to be fully present with each step, noticing the sensations of walking.",
      duration: 30
    },
    {
      title: "Begin walking slowly",
      instruction: "Start walking very slowly, much slower than normal. Pay attention to the lifting, moving, and placing of each foot.",
      duration: 60
    },
    {
      title: "Heel-to-toe awareness",
      instruction: "Notice how your heel makes contact first, then the ball of your foot, then your toes. Feel the weight shift.",
      duration: 90
    },
    {
      title: "Balance awareness",
      instruction: "Pay attention to the subtle adjustments your body makes to maintain balance as you walk.",
      duration: 60
    },
    {
      title: "Full body awareness",
      instruction: "Expand your awareness to include your entire body as you walk. Notice arm movement, posture, and breath.",
      duration: 90
    },
    {
      title: "Turn around mindfully",
      instruction: "When you reach the end of your path, pause. Turn around slowly with full awareness of the movement.",
      duration: 45
    },
    {
      title: "Continue practice",
      instruction: "Continue walking slowly in the opposite direction, maintaining full awareness of each step.",
      duration: 120
    },
    {
      title: "Gradual speed increase",
      instruction: "Gradually increase to a normal walking pace while maintaining awareness. Notice how the sensations change.",
      duration: 60
    },
    {
      title: "Closing reflection",
      instruction: "Come to a stop. Notice how your body feels after this practice. Consider how you might bring this awareness to your daily walking.",
      duration: 60
    }
  ],
  
  "20": [ // Thought Observation
    {
      title: "Comfortable position",
      instruction: "Sit comfortably with your back straight. Rest your hands on your lap or knees.",
      duration: 45
    },
    {
      title: "Breath anchor",
      instruction: "Close your eyes and take a few deep breaths. Allow your breathing to return to its natural rhythm.",
      duration: 45
    },
    {
      title: "Establish awareness",
      instruction: "Bring your attention to the present moment. Notice the sensations in your body and the rhythm of your breath.",
      duration: 60
    },
    {
      title: "Notice thoughts",
      instruction: "Begin to notice the thoughts that arise in your mind. Don't try to change or stop them, simply observe them.",
      duration: 60
    },
    {
      title: "Thoughts as clouds",
      instruction: "Imagine your thoughts as clouds passing through the sky of your mind. You are the observer watching them drift by.",
      duration: 90
    },
    {
      title: "Labeling practice",
      instruction: "As thoughts arise, gently label them: 'planning,' 'remembering,' 'worrying,' 'judging.' Then let them pass.",
      duration: 90
    },
    {
      title: "Notice attachment",
      instruction: "Notice if you become caught up in a thought. When this happens, gently acknowledge it and return to observing.",
      duration: 60
    },
    {
      title: "Expand awareness",
      instruction: "Widen your awareness to include emotions that may arise with thoughts. Observe them with the same gentle attention.",
      duration: 60
    },
    {
      title: "Notice the gaps",
      instruction: "Begin to notice the spaces between thoughts. Rest in these moments of mental quietness.",
      duration: 60
    },
    {
      title: "Closing reflection",
      instruction: "Reflect on what you've observed about your thought patterns. Remember that you are not your thoughts.",
      duration: 45
    },
    {
      title: "Gentle return",
      instruction: "Gradually bring your awareness back to your breath and body. When ready, slowly open your eyes.",
      duration: 45
    }
  ],
  
  // Physical exercises
  "6": [ // Gentle Movement Flow
    {
      title: "Preparation",
      instruction: "Stand with feet hip-width apart, knees slightly bent. Take a few deep breaths to center yourself.",
      duration: 30
    },
    {
      title: "Gentle neck rolls",
      instruction: "Drop your chin to your chest and slowly roll your head in a half-circle from one shoulder to the other. Repeat 3 times in each direction.",
      duration: 45
    },
    {
      title: "Shoulder circles",
      instruction: "Roll your shoulders forward 5 times, then backward 5 times. Feel any tension releasing with each movement.",
      duration: 45
    },
    {
      title: "Side stretches",
      instruction: "Raise your right arm overhead and lean gently to the left, feeling a stretch along your right side. Hold for 3 breaths, then switch sides.",
      duration: 60
    },
    {
      title: "Gentle twists",
      instruction: "Place your hands on your hips. Slowly twist your upper body to the right, then to the left. Repeat 5 times on each side.",
      duration: 60
    },
    {
      title: "Forward fold",
      instruction: "With knees slightly bent, hinge at your hips and fold forward. Let your head and arms hang heavy. Hold for 5 breaths.",
      duration: 45
    },
    {
      title: "Gentle backbend",
      instruction: "Place your hands on your lower back. Gently arch backward, looking up slightly. Hold for 3 breaths, then return to center.",
      duration: 45
    },
    {
      title: "Arm circles",
      instruction: "Extend your arms out to the sides. Make small circles, gradually increasing in size. Reverse direction after 10 circles.",
      duration: 45
    },
    {
      title: "Knee circles",
      instruction: "Place your hands on your knees and make circles with your knees, 5 in each direction. This releases tension in the hips and knees.",
      duration: 45
    },
    {
      title: "Final integration",
      instruction: "Stand tall, feet hip-width apart. Take three deep breaths, raising your arms on the inhale and lowering them on the exhale.",
      duration: 30
    }
  ],
  
  "10": [ // Yoga Flow
    {
      title: "Mountain Pose",
      instruction: "Stand with feet hip-width apart, arms at sides. Ground through your feet, lengthen your spine, and relax your shoulders.",
      duration: 45
    },
    {
      title: "Raised Arms Pose",
      instruction: "Inhale, raise your arms overhead, palms facing each other. Gently arch your back if comfortable.",
      duration: 30
    },
    {
      title: "Forward Fold",
      instruction: "Exhale, hinge at your hips and fold forward. Bend your knees as needed. Let your head and neck relax.",
      duration: 45
    },
    {
      title: "Half Lift",
      instruction: "Inhale, lift your chest halfway up, extending your spine forward. Place hands on shins or thighs if needed.",
      duration: 30
    },
    {
      title: "Forward Fold",
      instruction: "Exhale, return to forward fold. Relax your neck and shoulders.",
      duration: 30
    },
    {
      title: "Plank Pose",
      instruction: "Step or lightly hop back to plank position. Align your shoulders over your wrists, engage your core.",
      duration: 45
    },
    {
      title: "Knees, Chest, Chin",
      instruction: "Lower your knees to the floor, then your chest and chin, keeping your hips elevated.",
      duration: 30
    },
    {
      title: "Cobra Pose",
      instruction: "Lower your hips to the floor. Press through your hands to lift your chest, keeping your shoulders relaxed.",
      duration: 45
    },
    {
      title: "Downward Facing Dog",
      instruction: "Tuck your toes, lift your hips high, forming an inverted V-shape. Bend your knees if needed. Hold for 5 breaths.",
      duration: 60
    },
    {
      title: "Step to Forward Fold",
      instruction: "Step or lightly hop your feet between your hands, returning to forward fold.",
      duration: 30
    },
    {
      title: "Half Lift",
      instruction: "Inhale, lift your chest halfway up, extending your spine forward.",
      duration: 30
    },
    {
      title: "Forward Fold",
      instruction: "Exhale, return to forward fold.",
      duration: 30
    },
    {
      title: "Raised Arms Pose",
      instruction: "Inhale, rise up with a flat back, raising your arms overhead.",
      duration: 30
    },
    {
      title: "Mountain Pose",
      instruction: "Exhale, lower your arms to your sides, returning to mountain pose.",
      duration: 30
    },
    {
      title: "Repeat Flow",
      instruction: "Repeat this entire sequence two more times at your own pace, synchronizing movement with breath.",
      duration: 360
    },
    {
      title: "Final Relaxation",
      instruction: "Lie on your back with arms at your sides, palms up. Close your eyes and relax your entire body for 1-2 minutes.",
      duration: 120
    }
  ],
  
  "21": [ // Desk Stretches
    {
      title: "Preparation",
      instruction: "Sit at the edge of your chair with your feet flat on the floor, hip-width apart.",
      duration: 30
    },
    {
      title: "Neck rolls",
      instruction: "Drop your chin to your chest and slowly roll your head in a half-circle from one shoulder to the other. Repeat 3 times in each direction.",
      duration: 45
    },
    {
      title: "Shoulder rolls",
      instruction: "Roll your shoulders forward 5 times, then backward 5 times. Feel the tension releasing with each movement.",
      duration: 45
    },
    {
      title: "Wrist stretches",
      instruction: "Extend your right arm forward, palm up. Use your left hand to gently pull fingers back toward you. Hold for 15 seconds, then switch hands.",
      duration: 45
    },
    {
      title: "Seated spinal twist",
      instruction: "Place your right hand on your left knee and your left hand behind you. Gently twist to the left, looking over your shoulder. Hold for 30 seconds, then switch sides.",
      duration: 60
    },
    {
      title: "Forward fold",
      instruction: "Place your feet flat on the floor. Slowly bend forward, allowing your hands to reach toward the floor. Let your head and neck relax. Hold for 30 seconds.",
      duration: 45
    },
    {
      title: "Seated cat-cow",
      instruction: "Place hands on knees. Inhale, arch your back and look up (cow). Exhale, round your spine and look down (cat). Repeat 5 times.",
      duration: 45
    },
    {
      title: "Ankle circles",
      instruction: "Lift your right foot slightly off the floor. Rotate your ankle 5 times in each direction. Repeat with the left foot.",
      duration: 45
    },
    {
      title: "Final stretch",
      instruction: "Interlace fingers and stretch arms overhead, palms facing up. Take a deep breath in, then exhale and lower your arms.",
      duration: 30
    }
  ],
  
  "22": [ // Mood-Boosting Movement
    {
      title: "Warm-up",
      instruction: "Stand with feet hip-width apart. Gently swing your arms side to side, allowing your torso to follow the movement.",
      duration: 45
    },
    {
      title: "Reach for the sky",
      instruction: "Inhale deeply as you reach both arms overhead. Rise onto your tiptoes if comfortable. Exhale as you lower your arms and heels. Repeat 5 times.",
      duration: 45
    },
    {
      title: "Side stretches",
      instruction: "Raise your right arm overhead and lean gently to the left, feeling a stretch along your right side. Hold for 3 breaths, then switch sides. Repeat twice on each side.",
      duration: 60
    },
    {
      title: "Gentle twists",
      instruction: "With feet planted and knees slightly bent, swing your arms side to side, allowing your torso to twist naturally. Keep your hips facing forward.",
      duration: 45
    },
    {
      title: "Energy tapping",
      instruction: "Use your fingertips to gently tap across your shoulders, chest, arms, and legs. This stimulates energy flow and awakens your body.",
      duration: 60
    },
    {
      title: "Joy jumps",
      instruction: "Do 10 small, gentle jumps or bounces. If jumping isn't comfortable, rise onto your tiptoes repeatedly. Feel the energy rising through your body.",
      duration: 45
    },
    {
      title: "Dance break",
      instruction: "Put on your favorite upbeat song and dance freely for 1-2 minutes. There's no right or wrong way - just move in ways that feel good.",
      duration: 90
    },
    {
      title: "Victory pose",
      instruction: "Stand tall with feet hip-width apart. Raise your arms in a V-shape above your head. Hold this powerful pose for 30 seconds, breathing deeply.",
      duration: 45
    },
    {
      title: "Gratitude moment",
      instruction: "Place your hands over your heart. Take three deep breaths, feeling gratitude for your body and its ability to move.",
      duration: 45
    }
  ],
  
  "23": [ // Tension Release Exercises
    {
      title: "Body scan",
      instruction: "Stand or sit comfortably. Close your eyes and scan your body from head to toe, noticing areas of tension.",
      duration: 45
    },
    {
      title: "Progressive muscle relaxation - Upper body",
      instruction: "Tense your shoulders by bringing them toward your ears. Hold for 5 seconds, then release completely. Notice the difference between tension and relaxation.",
      duration: 30
    },
    {
      title: "Progressive muscle relaxation - Arms",
      instruction: "Make tight fists with both hands. Hold for 5 seconds, then release and spread your fingers wide. Feel the tension flowing out of your hands.",
      duration: 30
    },
    {
      title: "Progressive muscle relaxation - Face",
      instruction: "Scrunch your face tightly, including your eyes, nose, and mouth. Hold for 5 seconds, then release completely, letting your face become soft.",
      duration: 30
    },
    {
      title: "Neck release",
      instruction: "Gently drop your right ear toward your right shoulder. Hold for 3 breaths, then switch sides. Repeat twice on each side.",
      duration: 60
    },
    {
      title: "Shoulder circles",
      instruction: "Roll your shoulders forward 5 times, then backward 5 times. Make the circles as large as comfortable.",
      duration: 45
    },
    {
      title: "Gentle backbend",
      instruction: "Place your hands on your lower back. Gently arch backward, looking up slightly. Hold for 3 breaths, then return to center.",
      duration: 45
    },
    {
      title: "Forward fold",
      instruction: "Stand with feet hip-width apart. Bend forward from the hips, letting your upper body hang heavy. Bend your knees as needed. Hold for 30 seconds.",
      duration: 45
    },
    {
      title: "Gentle twists",
      instruction: "Sit on a chair or the floor. Twist gently to the right, placing your left hand on your right knee. Hold for 3 breaths, then switch sides.",
      duration: 60
    },
    {
      title: "Final relaxation",
      instruction: "Stand or sit tall. Take three deep breaths, imagining tension leaving your body with each exhale.",
      duration: 45
    }
  ],
  
  "24": [ // Energy Flow Sequence
    {
      title: "Centering breath",
      instruction: "Stand with feet hip-width apart. Take 5 deep breaths, feeling energy entering with each inhale and tension releasing with each exhale.",
      duration: 45
    },
    {
      title: "Sun breath",
      instruction: "Inhale, raise your arms out to the sides and up overhead. Exhale, lower your arms back down. Repeat 5 times, coordinating breath with movement.",
      duration: 45
    },
    {
      title: "Side body awakening",
      instruction: "Inhale, reach your right arm overhead and stretch to the left. Feel the expansion along your right side. Hold for 3 breaths, then switch sides.",
      duration: 60
    },
    {
      title: "Energizing twists",
      instruction: "Place hands on hips. Inhale, lengthen your spine. Exhale, twist to the right. Inhale back to center. Exhale, twist to the left. Repeat 5 times each side.",
      duration: 60
    },
    {
      title: "Forward fold with arm swings",
      instruction: "With knees slightly bent, fold forward from your hips. Let your arms hang, then gently swing them side to side. Continue for 30 seconds.",
      duration: 45
    },
    {
      title: "Energy taps",
      instruction: "Stand tall and use your fingertips to firmly tap up and down your arms, legs, chest, and back. This stimulates energy flow throughout your body.",
      duration: 60
    },
    {
      title: "Knee lifts",
      instruction: "March in place, lifting your knees high and swinging your arms. Continue for 45 seconds, breathing naturally.",
      duration: 60
    },
    {
      title: "Arm circles",
      instruction: "Extend your arms to the sides. Make 10 small circles forward, 10 medium circles, then 10 large circles. Repeat in the reverse direction.",
      duration: 60
    },
    {
      title: "Jumping jacks",
      instruction: "Do 20 jumping jacks at your own pace. If jumping is uncomfortable, step one foot out at a time while raising your arms.",
      duration: 45
    },
    {
      title: "Power pose",
      instruction: "Stand with feet wider than hip-width, hands on hips or arms raised in a V. Hold this powerful stance for 30 seconds, breathing deeply.",
      duration: 45
    },
    {
      title: "Cool down",
      instruction: "Walk in place slowly, allowing your heart rate to decrease. Take deep breaths, feeling energized yet centered.",
      duration: 45
    },
    {
      title: "Final integration",
      instruction: "Stand still with feet hip-width apart. Place your hands over your heart. Feel the energy flowing throughout your body.",
      duration: 30
    }
  ]
};