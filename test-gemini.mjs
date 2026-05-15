import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = 'AIzaSyARdwY1Q2zeau4QGz49kFGNQa1tkuUDaJM';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const systemPrompt = `You are a career counselor designing an adaptive psychometric and career interest test for an Indian student. 
The student's education stage is: after_10th.
Generate ONE multiple-choice question to determine their career interests. The question must be adaptive and logically follow their previous answers (if any).
Return ONLY a valid JSON object in this exact format, with no markdown formatting or backticks:
{
  "question": "The question text here?",
  "options": [
    { "label": "Option 1 text", "value": "opt1", "categories": ["engineering", "it_software"] },
    { "label": "Option 2 text", "value": "opt2", "categories": ["medical"] },
    { "label": "Option 3 text", "value": "opt3", "categories": ["management"] },
    { "label": "Option 4 text", "value": "opt4", "categories": ["skill_based"] }
  ]
}
Valid categories are ONLY: engineering, medical, management, civil_services, defense, it_software, diploma, skill_based. Assign 1 to 3 relevant categories to each option. Provide exactly 4 options.`;

const userPrompt = `Previous Q&A History:
Q1: What subject do you like?
Answer: Math

Generate the next question (Question 2 of 10). Respond ONLY with the raw JSON object, no markdown blocks.`;

async function test() {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }]
    });
    console.log(result.response.text());
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
