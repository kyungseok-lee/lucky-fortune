import OpenAI from "openai";
import i18n from './i18n';

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

  // 언어별 프롬프트 지시문 및 프롬프트 템플릿
  const lang = i18n?.language || 'en';
  let langInstruction = '';
  let prompt = '';
  switch (lang) {
    case 'ko':
      langInstruction = '모든 내용은 한국어로 작성하고, 긍정적이면서도 현실적인 조언을 해주세요.';
      prompt = `당신은 한국 전통 사주 전문가입니다. 다음 생년월일을 가진 사람의 ${birthData.currentDate} 오늘의 운세를 한국 전통 사주학을 바탕으로 분석해주세요.\n\n생년월일: ${birthData.year}년 ${birthData.month}월 ${birthData.day}일\n오늘 날짜: ${birthData.currentDate}\n\n다음 형식의 JSON으로 응답해주세요:\n{\n  "overallFortune": "오늘의 전체적인 운세 (2-3문장)",\n  "loveFortune": "애정운 분석 (2문장)",\n  "careerFortune": "직장운 분석 (2문장)", \n  "moneyFortune": "금전운 분석 (2문장)",\n  "healthFortune": "건강운 분석 (2문장)",\n  "luckyNumber": 1-9 사이의 행운의 숫자,\n  "luckyColor": "행운의 색깔 (한글로)",\n  "luckyDirection": "행운의 방향 (동서남북 중 하나)",\n  "todayAdvice": "오늘의 조언 (2-3문장)",\n  "warningAdvice": "주의사항 (2문장)",\n  "overallScore": 1-5 사이의 총운 점수,\n  "loveScore": 1-5 사이의 애정운 점수,\n  "careerScore": 1-5 사이의 직장운 점수,\n  "moneyScore": 1-5 사이의 금전운 점수,\n  "healthScore": 1-5 사이의 건강운 점수\n}\n\n${langInstruction}`;
      break;
    case 'zh':
      langInstruction = '请用简体中文回答所有内容，并给出积极且现实的建议。';
      prompt = `你是一位韩国传统四柱命理专家。请根据韩国传统命理学，分析下列生日用户在${birthData.currentDate}的今日运势。\n\n生日：${birthData.year}年${birthData.month}月${birthData.day}日\n今日日期：${birthData.currentDate}\n\n请以如下JSON格式回复：\n{\n  "overallFortune": "今日整体运势（2-3句）",\n  "loveFortune": "爱情运分析（2句）",\n  "careerFortune": "事业运分析（2句）",\n  "moneyFortune": "财运分析（2句）",\n  "healthFortune": "健康运分析（2句）",\n  "luckyNumber": 1-9之间的幸运数字,\n  "luckyColor": "幸运颜色（中文）",\n  "luckyDirection": "幸运方向（东南西北之一）",\n  "todayAdvice": "今日建议（2-3句）",\n  "warningAdvice": "注意事项（2句）",\n  "overallScore": 1-5之间的总运分数,\n  "loveScore": 1-5之间的爱情运分数,\n  "careerScore": 1-5之间的事业运分数,\n  "moneyScore": 1-5之间的财运分数,\n  "healthScore": 1-5之间的健康运分数\n}\n\n${langInstruction}`;
      break;
    case 'es':
      langInstruction = 'Responde todo en español y proporciona consejos positivos pero realistas.';
      prompt = `Eres un experto en Saju tradicional coreano. Analiza la fortuna de hoy para la siguiente fecha de nacimiento según la tradición coreana.\n\nFecha de nacimiento: ${birthData.day}/${birthData.month}/${birthData.year}\nFecha de hoy: ${birthData.currentDate}\n\nResponde en el siguiente formato JSON:\n{\n  "overallFortune": "Fortuna general de hoy (2-3 frases)",\n  "loveFortune": "Análisis de amor (2 frases)",\n  "careerFortune": "Análisis de carrera (2 frases)",\n  "moneyFortune": "Análisis de dinero (2 frases)",\n  "healthFortune": "Análisis de salud (2 frases)",\n  "luckyNumber": "Número de la suerte entre 1 y 9",\n  "luckyColor": "Color de la suerte (en español)",\n  "luckyDirection": "Dirección de la suerte (norte, sur, este, oeste)",\n  "todayAdvice": "Consejo de hoy (2-3 frases)",\n  "warningAdvice": "Advertencia (2 frases)",\n  "overallScore": "Puntaje general entre 1 y 5",\n  "loveScore": "Puntaje de amor entre 1 y 5",\n  "careerScore": "Puntaje de carrera entre 1 y 5",\n  "moneyScore": "Puntaje de dinero entre 1 y 5",\n  "healthScore": "Puntaje de salud entre 1 y 5"\n}\n\n${langInstruction}`;
      break;
    case 'ja':
      langInstruction = 'すべて日本語で回答し、前向きかつ現実的なアドバイスをしてください。';
      prompt = `あなたは韓国伝統の四柱推命の専門家です。次の生年月日の方の${birthData.currentDate}の今日の運勢を韓国伝統の四柱推命に基づいて分析してください。\n\n生年月日: ${birthData.year}年${birthData.month}月${birthData.day}日\n本日の日付: ${birthData.currentDate}\n\n次のJSON形式で回答してください:\n{\n  "overallFortune": "今日の全体運勢（2～3文）",\n  "loveFortune": "恋愛運の分析（2文）",\n  "careerFortune": "仕事運の分析（2文）",\n  "moneyFortune": "金運の分析（2文）",\n  "healthFortune": "健康運の分析（2文）",\n  "luckyNumber": "1～9のラッキーナンバー",\n  "luckyColor": "ラッキーカラー（日本語で）",\n  "luckyDirection": "ラッキー方位（東西南北のいずれか）",\n  "todayAdvice": "今日のアドバイス（2～3文）",\n  "warningAdvice": "注意事項（2文）",\n  "overallScore": "1～5の総合運スコア",\n  "loveScore": "1～5の恋愛運スコア",\n  "careerScore": "1～5の仕事運スコア",\n  "moneyScore": "1～5の金運スコア",\n  "healthScore": "1～5の健康運スコア"\n}\n\n${langInstruction}`;
      break;
    default:
      langInstruction = 'Write all content in English, and provide positive yet realistic advice.';
      prompt = `You are a Korean traditional Saju (Four Pillars) expert. Please analyze today's fortune for the following birth date based on Korean Saju.\n\nBirth date: ${birthData.year}-${birthData.month}-${birthData.day}\nToday's date: ${birthData.currentDate}\n\nRespond in the following JSON format:\n{\n  "overallFortune": "Overall fortune for today (2-3 sentences)",\n  "loveFortune": "Love fortune analysis (2 sentences)",\n  "careerFortune": "Career fortune analysis (2 sentences)",\n  "moneyFortune": "Money fortune analysis (2 sentences)",\n  "healthFortune": "Health fortune analysis (2 sentences)",\n  "luckyNumber": "Lucky number between 1 and 9",\n  "luckyColor": "Lucky color (in English)",\n  "luckyDirection": "Lucky direction (north, south, east, west)",\n  "todayAdvice": "Today's advice (2-3 sentences)",\n  "warningAdvice": "Warning (2 sentences)",\n  "overallScore": "Overall score between 1 and 5",\n  "loveScore": "Love score between 1 and 5",\n  "careerScore": "Career score between 1 and 5",\n  "moneyScore": "Money score between 1 and 5",\n  "healthScore": "Health score between 1 and 5"\n}\n\n${langInstruction}`;
  }

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
