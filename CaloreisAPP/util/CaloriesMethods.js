import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCaCrUwzFYgCkfPkg9oQJr_L22dFisTZzY");

function parseStringToObj(inputString) {
  let lines = inputString.split("\n");
  let result = {};

  // Loop through each line and process it
  lines.forEach((line) => {
    let parts = line.split(":");
    let key = parts[0].trim();
    let value = parts.slice(1).join(":").trim();
    if (key === "Calories") {
      result.calories = value;
    } else if (key === "Description") {
      result.description = value;
    }else if(key==="Food"){
       result.foods = value;
    }
  });
  return result;
}

async function getCaloriesInformation(question) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You will be asked a question. Your reply should include a Calories and a descriptive paragraph as illustrated below.
                    Example question: i ate apple and burger calculate calories
                    Example reply:
                    Food:apple and burger 
                    Calories: the number of Calories
                    Description: the medium apple has 62 Calories.
                    Question: [${question}]
                    Reply:
                   `;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return parseStringToObj(text);
}
export {getCaloriesInformation};