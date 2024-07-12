import { GoogleGenerativeAI } from "@google/generative-ai"
GOOGLE_API_KEY=AIzaSyDAC3HZ01VbQqgOkL9pEBTwibSbBvYcqUg

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
async function getAlbumNames(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be sent a label for specific topic or an entity and wou should send me an full URL for an image
                    that matches this topic or this entity 
                    Example topic: Football
                            reply: https://looking-for-soccer.com/wp-content/uploads/2021/12/football-g475eabc40_1280-1024x682.jpg
                    Example topic: Economics
                            reply: https://www.investopedia.com/thmb/NhnAQzNqF2HrcKDmNZprh3JCk04=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/economics-source-b80e91b606bd4729815840bad4ff3ecd.png                  
                    name: ${topic}
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}