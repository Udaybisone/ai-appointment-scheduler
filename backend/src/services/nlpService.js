import { textModel } from './geminiClient.js';

/**
 * extractEntities
 * Input: rawText
 * Output:
 * {
 *   entities: { date_phrase, time_phrase, department },
 *   entities_confidence,
 *   needs_clarification,
 *   reason
 * }
 */
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
`;

  try {
    const result = await textModel.generateContent([
      systemPrompt,
      `User text: """${rawText}"""`
    ]);

    const response = await result.response;
    const text = response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn('Failed to parse entities JSON, fallback:', text);
      // fallback minimal
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
