import { DateTime } from 'luxon';
import { textModel } from './geminiClient.js';

const TIMEZONE = 'Asia/Kolkata';

/**
 * normalizeEntities
 * Input: entities from extractEntities
 * Output:
 * {
 *   normalized: { date, time, tz, department_canonical },
 *   normalization_confidence,
 *   needs_clarification,
 *   reason
 * }
 */
export const normalizeEntities = async (entities) => {
  const { date_phrase, time_phrase, department } = entities || {};

  // Quick guard: if any essential piece is missing
  if (!date_phrase || !time_phrase || !department) {
    return {
      normalized: null,
      normalization_confidence: 0,
      needs_clarification: true,
      reason: 'Missing date, time, or department phrase.'
    };
  }

  const now = DateTime.now().setZone(TIMEZONE).toISO();

  const systemPrompt = `
You normalize appointment entities.

Given:
- a natural language date phrase,
- a time phrase,
- a department/specialty,
- and "now" in ISO for reference,
return strict JSON only with this shape:

{
  "normalized": {
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "tz": "Asia/Kolkata",
    "department_canonical": "Capitalized department name like Dentistry, Cardiology etc."
  },
  "normalization_confidence": number between 0 and 1,
  "needs_clarification": boolean,
  "reason": "string"
}

Rules:
- Interpret date relative to "now".
- If the phrase is "next Friday", "tomorrow", etc, compute the correct future date.
- If you are not sure of exact date or time, set needs_clarification=true.
- tz must always be "Asia/Kolkata".
`;

  const userPrompt = `
Now: ${now}
Date phrase: "${date_phrase}"
Time phrase: "${time_phrase}"
Department phrase: "${department}"
`;

  try {
    const result = await textModel.generateContent([
      systemPrompt,
      userPrompt
    ]);
    const response = await result.response;
    const text = response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn('Failed to parse normalization JSON, fallback:', text);
      parsed = {
        normalized: null,
        normalization_confidence: 0,
        needs_clarification: true,
        reason: 'Model returned non-JSON for normalization.'
      };
    }

    // Safety: enforce tz and simple format check
    if (parsed.normalized) {
      parsed.normalized.tz = TIMEZONE;
    }

    return parsed;
  } catch (err) {
    console.error('Normalization error:', err);
    return {
      normalized: null,
      normalization_confidence: 0,
      needs_clarification: true,
      reason: 'Internal error in normalization.'
    };
  }
};
