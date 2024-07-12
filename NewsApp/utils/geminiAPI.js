import { GoogleGenerativeAI } from "@google/generative-ai"
let GOOGLE_API_KEY="AIzaSyDAC3HZ01VbQqgOkL9pEBTwibSbBvYcqUg";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

async function getTopicNews(topic){
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be sent a specific topic and you should send me an URL for a website 
                    that contains latest news about this topic. 
                    Example topic: sports news
                            reply: https://www.skysports.com/
                    Example topic: Economics
                            reply: https://www.bbc.com/news/business/economy                
                    name: ${topic}
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
export default getTopicNews;