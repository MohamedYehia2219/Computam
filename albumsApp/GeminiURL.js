import { GoogleGenerativeAI } from "@google/generative-ai"
import axios from 'axios'
import 'dotenv/config'

async function run(imageUrl) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Fetching the image from the URL
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer'
    });
    
    const image = {
      inlineData: {
        data: Buffer.from(response.data).toString('base64'),
        mimeType: 'image/jpeg', // Adjust mimeType according to the image format
      },
    };
    
    const prompt = `A user uploaded this photo to our website.
     recognise all possible entities in the photo with out punctuation or stop words and return this text only
     to be saved in the database that should be helpful when the user searches for this photo in the future`;
  
    const result = await model.generateContent([prompt, image]);
    return result.response.text();
  } catch (error) {
    console.error("Error fetching or processing image:", error);
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
async function getAlbumNames(name) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be sent a name for a photo album. Your reply should the possible related names to this name and the 
                    first letter should be capital.
                    Example name: Football album
                            reply: Sports, Sport, Players, Player, Ball, Match
                    Example name: Family album
                            reply: Parents, Home, People, Happiness, Memories
                    Example name: Friends
                            reply: Friendship, Buddy, Colleague, Moments, Happiness, Memories                   
                    name: ${name}
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
export {getAlbumNames};
export {run}
