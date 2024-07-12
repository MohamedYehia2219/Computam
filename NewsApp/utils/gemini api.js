import { GoogleGenerativeAI } from "@google/generative-ai"
let GOOGLE_API_KEY="AIzaSyDAC3HZ01VbQqgOkL9pEBTwibSbBvYcqUg";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
async function getRightName(name) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be sent a name for specific topic or entity but this name may have spelling mistake or may be abbreviated,
                    if that you should return the right complete name only or return the passed name.
                    Example name: mo salah
                            reply: mohamed salah
                    Example name: econimics
                            reply: economics
                    Example name: ehgyt
                            reply: egypt
                     Example name: Gaza
                            reply: Gaza                  
                    name: ${name}
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
export default getRightName;