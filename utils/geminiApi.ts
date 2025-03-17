import axios from 'axios';

// Get API key from environment variables
export const GEMINI_API_KEY = 'AIzaSyBNRQd0dE0bWPlB9zUvjiuPrf8IP5Z6q6A' ;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}
export async function generateContentWithGemini(prompt: string): Promise<string> {
  try {
    console.log('Sending request to Gemini API with prompt:', prompt);
    
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key found in environment variables. Using simulated response.');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "This is a simulated response from Gemini API because no API key was provided.";
    }
    
    // Make the actual API call with the key from environment variables
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }
    );
    
    const data = response.data as GeminiResponse;
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Sorry, there was an error communicating with the Gemini API. Please try again later.";
  }
}