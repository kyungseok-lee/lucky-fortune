import OpenAI from "openai";

// Global variable to store API key
let cachedApiKey: string | null = null;

// Function to get API key from server
async function getApiKey(): Promise<string> {
  if (cachedApiKey) {
    return cachedApiKey;
  }
  
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    cachedApiKey = config.openaiApiKey;
    return cachedApiKey || "";
  } catch (error) {
    console.error("Failed to fetch API key from server:", error);
    return "";
  }
}

export interface FortunePromptData {
  year: number;
  month: number;
  day: number;
  currentDate: string;
}

export async function generateFortune(birthData: FortunePromptData): Promise<any> {
  const apiKey = await getApiKey();
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("OpenAI API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
  }

  const openai = new OpenAI({ 
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 한국 전통 사주학 전문가입니다. 정확하고 의미있는 운세를 제공해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI 응답을 받을 수 없습니다.");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    
    // API 할당량 초과 시 샘플 데이터 반환
    if (error && typeof error === 'object' && 'code' in error && error.code === 'insufficient_quota') {
      return getSampleFortune(birthData);
    }
    
    throw new Error("운세 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

// 샘플 운세 데이터 (API 키 문제 시 사용)
function getSampleFortune(birthData: FortunePromptData): any {
  const sampleData = {
    overallFortune: "오늘은 전반적으로 좋은 기운이 흐르는 날입니다. 새로운 시작에 적합한 때이며, 긍정적인 마음가짐으로 하루를 보내시면 좋은 결과를 얻을 수 있을 것입니다. 주변 사람들과의 관계에서도 화합의 기운이 강합니다.",
    loveFortune: "애정 운세가 매우 밝습니다. 연인이 있다면 더욱 깊은 유대감을 느낄 수 있고, 솔로라면 새로운 만남의 기회가 찾아올 수 있습니다.",
    careerFortune: "직장에서 인정받을 기회가 생길 것입니다. 평소 준비해온 일들이 빛을 발할 때이니 자신감을 가지고 임하세요.",
    moneyFortune: "금전적으로 안정적인 하루가 될 것입니다. 투자나 중요한 결정은 신중하게 하시되, 작은 기회를 놓치지 마세요.",
    healthFortune: "전반적인 컨디션이 좋습니다. 다만 과로는 피하시고 충분한 휴식을 취하시기 바랍니다.",
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    luckyColor: ["빨강", "파랑", "노랑", "초록", "보라"][Math.floor(Math.random() * 5)],
    luckyDirection: ["동", "서", "남", "북"][Math.floor(Math.random() * 4)],
    todayAdvice: "오늘은 새로운 도전을 시작하기에 좋은 날입니다. 두려워하지 말고 한 걸음씩 나아가세요. 주변 사람들의 조언에 귀 기울이면 더 좋은 결과를 얻을 수 있습니다.",
    warningAdvice: "감정적인 결정은 피하시고, 중요한 일은 충분히 검토한 후 진행하세요. 건강 관리에도 신경 쓰시기 바랍니다.",
    overallScore: Math.floor(Math.random() * 2) + 4, // 4-5
    loveScore: Math.floor(Math.random() * 3) + 3, // 3-5
    careerScore: Math.floor(Math.random() * 2) + 4, // 4-5
    moneyScore: Math.floor(Math.random() * 3) + 3, // 3-5
    healthScore: Math.floor(Math.random() * 2) + 4 // 4-5
  };
  
  return sampleData;
}
