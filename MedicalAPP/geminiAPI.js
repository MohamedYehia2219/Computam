import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyC8plVAj0RbQrnzos-Y3dKZysdbw7OiJj8");

async function getMedicinesInformation(medicine) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You will take a name of a medicine and your brief reply should include the uses of this medicine,
                      side effects of this medicine, the recommended dosage, the names of some other medicines that may conflict with this medicine
                      and other useful information. Each part is only one brief paragraph without heading, don't use new lines.
                      Medicine name: ${medicine}
                      Example for the reply:
                      Uses:
                      Side Effects: 
                      Recommended Dosage: 
                      Medicines that may conflict with it:  
                      Other Information: `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
}
export default getMedicinesInformation;