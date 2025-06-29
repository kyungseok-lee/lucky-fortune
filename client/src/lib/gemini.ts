import { GoogleGenAI } from "@google/genai";

// Global variable to store API key
let cachedGeminiApiKey: string | null = null;

// Function to get Gemini API key from server
async function getGeminiApiKey(): Promise<string> {
  if (cachedGeminiApiKey) {
    return cachedGeminiApiKey;
  }
  
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    cachedGeminiApiKey = config.geminiApiKey;
    return cachedGeminiApiKey || "";
  } catch (error) {
    console.error("Failed to fetch Gemini API key from server:", error);
    return "";
  }
}

export interface FortunePromptData {
  year: number;
  month: number;
  day: number;
  currentDate: string;
}

export async function generateFortuneWithGemini(birthData: FortunePromptData): Promise<any> {
  const apiKey = await getGeminiApiKey();
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Gemini API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `당신은 한국 전통 사주 전문가입니다. 다음 생년월일을 가진 사람의 ${birthData.currentDate} 오늘의 운세를 한국 전통 사주학을 바탕으로 분석해주세요.

생년월일: ${birthData.year}년 ${birthData.month}월 ${birthData.day}일
오늘 날짜: ${birthData.currentDate}

다음 형식의 JSON으로 응답해주세요:
{
  "overallFortune": "오늘의 전체적인 운세 (2-3문장)",
  "loveFortune": "애정운 분석 (2문장)",
  "careerFortune": "직장운 분석 (2문장)", 
  "moneyFortune": "금전운 분석 (2문장)",
  "healthFortune": "건강운 분석 (2문장)",
  "luckyNumber": 1-9 사이의 행운의 숫자,
  "luckyColor": "행운의 색깔 (한글로)",
  "luckyDirection": "행운의 방향 (동서남북 중 하나)",
  "todayAdvice": "오늘의 조언 (2-3문장)",
  "warningAdvice": "주의사항 (2문장)",
  "overallScore": 1-5 사이의 총운 점수,
  "loveScore": 1-5 사이의 애정운 점수,
  "careerScore": 1-5 사이의 직장운 점수,
  "moneyScore": 1-5 사이의 금전운 점수,
  "healthScore": 1-5 사이의 건강운 점수
}

모든 내용은 한국어로 작성하고, 긍정적이면서도 현실적인 조언을 해주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "당신은 한국 전통 사주학 전문가입니다. 정확하고 의미있는 운세를 제공해주세요.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallFortune: { type: "string" },
            loveFortune: { type: "string" },
            careerFortune: { type: "string" },
            moneyFortune: { type: "string" },
            healthFortune: { type: "string" },
            luckyNumber: { type: "number" },
            luckyColor: { type: "string" },
            luckyDirection: { type: "string" },
            todayAdvice: { type: "string" },
            warningAdvice: { type: "string" },
            overallScore: { type: "number" },
            loveScore: { type: "number" },
            careerScore: { type: "number" },
            moneyScore: { type: "number" },
            healthScore: { type: "number" }
          },
          required: ["overallFortune", "loveFortune", "careerFortune", "moneyFortune", "healthFortune", "luckyNumber", "luckyColor", "luckyDirection", "todayAdvice", "warningAdvice", "overallScore", "loveScore", "careerScore", "moneyScore", "healthScore"]
        }
      },
      contents: prompt,
    });

    const content = response.text;
    if (!content) {
      throw new Error("Gemini 응답을 받을 수 없습니다.");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Gemini API 오류:", error);
    
    // Gemini API 오류 시 샘플 데이터 반환
    return getSampleFortuneForGemini(birthData);
  }
}

// 샘플 운세 데이터 (Gemini API 문제 시 사용)
function getSampleFortuneForGemini(birthData: FortunePromptData): any {
  const sampleData = {
    overallFortune: "오늘은 창의적인 에너지가 충만한 날입니다. 새로운 아이디어가 떠오르기 쉬우며, 직감을 믿고 행동하면 좋은 결과를 얻을 수 있습니다. 주변의 변화를 긍정적으로 받아들이는 자세가 중요합니다.",
    loveFortune: "감정적인 교감이 깊어지는 시기입니다. 상대방의 마음을 이해하려는 노력이 관계 발전에 큰 도움이 될 것입니다.",
    careerFortune: "업무에서 창의적인 해결책을 찾을 수 있는 날입니다. 동료들과의 협력을 통해 예상보다 좋은 성과를 거둘 수 있습니다.",
    moneyFortune: "신중한 투자 판단이 필요한 시기입니다. 장기적인 관점에서 접근하면 안정적인 수익을 기대할 수 있습니다.",
    healthFortune: "정신적, 육체적 밸런스가 잘 맞는 시기입니다. 규칙적인 생활 패턴을 유지하면 더욱 좋은 컨디션을 유지할 수 있습니다.",
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    luckyColor: ["분홍", "하늘색", "연두", "라벤더", "오렌지"][Math.floor(Math.random() * 5)],
    luckyDirection: ["동북", "서남", "남동", "북서"][Math.floor(Math.random() * 4)],
    todayAdvice: "변화를 두려워하지 마세요. 오늘은 새로운 기회가 찾아올 수 있는 날입니다. 열린 마음으로 하루를 보내면 뜻밖의 좋은 일이 생길 수 있습니다.",
    warningAdvice: "성급한 판단은 금물입니다. 중요한 결정은 충분히 고민한 후 내리시고, 감정에 휩쓸리지 않도록 주의하세요.",
    overallScore: Math.floor(Math.random() * 2) + 4, // 4-5
    loveScore: Math.floor(Math.random() * 3) + 3, // 3-5
    careerScore: Math.floor(Math.random() * 2) + 4, // 4-5
    moneyScore: Math.floor(Math.random() * 3) + 3, // 3-5
    healthScore: Math.floor(Math.random() * 2) + 4 // 4-5
  };
  
  return sampleData;
}