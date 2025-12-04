import { textModel } from './geminiClient.js';

export const extractEntities = async (rawText) => {
  const systemPrompt = `
You extract appointment entities from text.
Return strict JSON only, with this shape:

{
  "entities": {
    "date_phrase": "string or null",
    "time_phrase": "string or null",
    "department": "string or null"
  },
  "entities_confidence": number between 0 and 1,
  "needs_clarification": boolean,
  "reason": "string"
}

Set needs_clarification=true if:
- date or time is missing or ambiguous (like "sometime tomorrow evening"),
- department is unclear (like "doctor" without specialty),
otherwise false.

Very important:
- DO NOT wrap the JSON in backticks.
- DO NOT add \`\`\`json or any code block.
- DO NOT add any extra text before or after the JSON.
`;

  try {
    const prompt = `${systemPrompt}

User text: """${rawText}"""
`;
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log('RAW GEMINI OUTPUT:', text);

    let jsonString = text;
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      console.warn('No JSON braces found, fallback.');
      return {
        entities: {
          date_phrase: null,
          time_phrase: null,
          department: null
        },
        entities_confidence: 0,
        needs_clarification: true,
        reason: 'Model returned non-JSON.'
      };
    }

    jsonString = jsonString.slice(firstBrace, lastBrace + 1).trim();
    console.log('JSON CANDIDATE STRING:', jsonString);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
      console.log('PARSED ENTITIES OBJECT:', parsed);
    } catch (err) {
      console.warn('JSON.parse failed, fallback. Error:', err.message);
      parsed = {
        entities: {
          date_phrase: null,
          time_phrase: null,
          department: null
        },
        entities_confidence: 0,
        needs_clarification: true,
        reason: 'Model returned non-JSON.'
      };
    }

    return parsed;
  } catch (err) {
    console.error('Entity extraction error:', err);
    return {
      entities: {
        date_phrase: null,
        time_phrase: null,
        department: null
      },
      entities_confidence: 0,
      needs_clarification: true,
      reason: 'Internal error in entity extraction.'
    };
  }
};
