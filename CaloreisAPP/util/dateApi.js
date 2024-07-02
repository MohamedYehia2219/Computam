import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCaCrUwzFYgCkfPkg9oQJr_L22dFisTZzY");

async function getDate(day) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be sent an expression for a specific previous day. Your reply should be the the accurate date of this day.
                    Example day: today
                            reply: ${new Date().toLocaleDateString()} 
                    Example day: last friday
                            reply: 5/31/2024 
                    Example day: last sunday
                            reply: 5/26/2024         
                    day: [${day}]
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
export {getDate};