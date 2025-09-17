import { GoogleGenAI, Type } from "@google/genai";
import type { Place, MEOAnalysis } from '../types';

// IMPORTANT: This assumes the API key is set in the environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling or a fallback.
  // For this example, we throw an error to make it clear the key is missing.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    meoScore: {
      type: Type.NUMBER,
      description: '10段階評価のMEOスコア。'
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'MEO観点での強みを2つ。'
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'MEO観点での改善点を2つ。'
    },
  },
  required: ['meoScore', 'strengths', 'weaknesses']
};


export const analyzePlaceMEO = async (place: Place, isGbpVerified: boolean): Promise<MEOAnalysis> => {
  const gbpStatusText = isGbpVerified
    ? "この店舗はGoogleビジネスプロフィールにオーナー登録済みです。"
    : "この店舗はGoogleビジネスプロフィールにオーナー未登録の可能性が高いです。改善点として「GBPへのオーナー登録と情報拡充」を必ず含めてください。";

  const prompt = `
あなたはMEOコンサルタントです。以下の店舗情報を分析し、MEO（マップエンジン最適化）の観点から評価してください。

${gbpStatusText} この事実を踏まえて、評価と改善点の提案をお願いします。

店舗情報:
\`\`\`json
{
  "displayName": "${place.displayName.text}",
  "rating": ${place.rating || 'N/A'},
  "userRatingCount": ${place.userRatingCount || 0},
  "reviewSummary": "${place.reviewSummary?.text || 'なし'}"
}
\`\`\`

評価項目として、以下のJSON形式で回答してください。

- meoScore: 10段階評価の数値。レビュー数(userRatingCount)、評価の高さ(rating)、レビューサマリーの有無、GBP登録状況を総合的に判断してください。
- strengths: MEO観点での強みを箇条書きの配列で2つ挙げてください。
- weaknesses: MEO観点での改善点を箇条書きの配列で2つ挙げてください。

回答は必ず指定されたJSONスキーマに従ってください。説明や前置きは一切不要です。
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const analysisResult = JSON.parse(jsonText);
    return analysisResult as MEOAnalysis;
  } catch (error) {
    console.error('Error analyzing MEO:', error);
    // Return a default/error state object
    return {
      meoScore: 0,
      strengths: ['分析中にエラーが発生しました。'],
      weaknesses: ['Gemini APIの呼び出しに失敗した可能性があります。']
    };
  }
};

export const translateText = async (text: string, targetLang: string = 'ja'): Promise<string> => {
  const prompt = `以下のテキストを日本語に翻訳してください。翻訳結果のテキストのみを返してください。:

"${text}"
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error translating text:', error);
    return "翻訳に失敗しました。";
  }
};
