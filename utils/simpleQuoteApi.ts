import axios from 'axios';

const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function getSimpleQuote() {
  try {
    const prompt = "give me a quote about mental health within 2 sentences with the author aswell. put the quote in normal text and the author in bold. I dont want you to say anything expect the quote, and make sure its a real quote e.g Your mental health is a priority. Your happiness is essential. Your self-care is a necessity Unknown";
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}?key=${API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    });
    
    console.log('Simple API response:', JSON.stringify(response.data).substring(0, 500));
    
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      return response.data.candidates[0].content.parts[0].text;
    }
    
    return null;
  } catch (error) {
    console.error('Simple quote API error:', error);
    return null;
  }
}