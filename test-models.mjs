import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = 'AIzaSyARdwY1Q2zeau4QGz49kFGNQa1tkuUDaJM';
const genAI = new GoogleGenerativeAI(apiKey);
async function test() {
  for (const m of ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('hi');
      console.log(m, 'SUCCESS');
    } catch(e) {
      console.error(m, 'FAIL', e.message);
    }
  }
}
test();
