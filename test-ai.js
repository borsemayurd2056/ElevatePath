import { config } from "dotenv";
config();

async function test() {
  try {
    const AI_GATEWAY_KEY = process.env.AI_GATEWAY_KEY;
    if (!AI_GATEWAY_KEY) throw new Error("AI_GATEWAY_KEY is not configured");

    const stage = "after_10th";
    const history = [];

    const systemPrompt = `You are a career counselor designing an adaptive psychometric and career interest test for an Indian student. 
The student's education stage is: ${stage}.
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

    let historyText = "No previous questions.";
    if (history && history.length > 0) {
      historyText = history.map((h, i) => `Q${i+1}: ${h.question}\nAnswer: ${h.answer}`).join("\n\n");
    }
    const userPrompt = `Previous Q&A History:\n${historyText}\n\nGenerate the next question (Question ${history ? history.length + 1 : 1} of 10). Respond ONLY with the raw JSON object, no markdown blocks.`;

    const response = await fetch("https://ai.gateway.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("Raw response:", JSON.stringify(data, null, 2));
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("\nContent extracted:");
    console.log(content);
    
    let resultStr = content;
    if (resultStr.includes("\`\`\`json")) {
      resultStr = resultStr.split("\`\`\`json")[1].split("\`\`\`")[0];
    } else if (resultStr.includes("\`\`\`")) {
      resultStr = resultStr.split("\`\`\`")[1].split("\`\`\`")[0];
    }
    
    console.log("\nParsed JSON:");
    console.log(JSON.parse(resultStr.trim()));
    
  } catch (err) {
    console.error(err);
  }
}

test();
