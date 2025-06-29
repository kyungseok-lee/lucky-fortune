import { GoogleGenAI } from "@google/genai";
import i18n from './i18n';

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
    case 'zh-CN':
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
  const lang = i18n?.language || 'en';
  
  switch (lang) {
    case 'ko':
      return {
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
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'zh':
    case 'zh-CN':
      return {
        overallFortune: "今天是充满创意能量的一天。新的想法容易浮现，相信直觉行动会得到好结果。以积极的态度接受周围的变化很重要。",
        loveFortune: "这是感情交流加深的时期。努力理解对方的心情对关系发展会有很大帮助。",
        careerFortune: "这是在工作中能找到创意解决方案的一天。通过与同事的合作能取得比预期更好的成果。",
        moneyFortune: "需要谨慎投资判断的时期。从长远角度来看，可以期待稳定的收益。",
        healthFortune: "这是精神和身体平衡良好的时期。保持规律的生活模式能维持更好的状态。",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["粉红", "天蓝", "嫩绿", "薰衣草", "橙色"][Math.floor(Math.random() * 5)],
        luckyDirection: ["东北", "西南", "东南", "西北"][Math.floor(Math.random() * 4)],
        todayAdvice: "不要害怕变化。今天可能会有新机会到来。以开放的心态度过一天，会有意想不到的好事发生。",
        warningAdvice: "禁止急躁的判断。重要的决定要充分考虑后再做，注意不要被情绪左右。",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'es':
      return {
        overallFortune: "Hoy es un día lleno de energía creativa. Es fácil que surjan nuevas ideas, y si actúas siguiendo tu intuición obtendrás buenos resultados. Es importante aceptar positivamente los cambios del entorno.",
        loveFortune: "Es un período en el que se profundiza la comunicación emocional. El esfuerzo por entender el corazón del otro será de gran ayuda para el desarrollo de la relación.",
        careerFortune: "Es un día en el que puedes encontrar soluciones creativas en el trabajo. A través de la cooperación con colegas podrás obtener mejores resultados de lo esperado.",
        moneyFortune: "Es un período que requiere juicio prudente en las inversiones. Si enfocas desde una perspectiva a largo plazo, puedes esperar beneficios estables.",
        healthFortune: "Es un período en el que el equilibrio mental y físico está bien. Si mantienes un patrón de vida regular, podrás mantener una mejor condición.",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["Rosa", "Celeste", "Verde claro", "Lavanda", "Naranja"][Math.floor(Math.random() * 5)],
        luckyDirection: ["Noreste", "Suroeste", "Sureste", "Noroeste"][Math.floor(Math.random() * 4)],
        todayAdvice: "No temas al cambio. Hoy puede llegar una nueva oportunidad. Si pasas el día con mente abierta, pueden suceder cosas buenas inesperadas.",
        warningAdvice: "Los juicios apresurados están prohibidos. Toma decisiones importantes después de pensarlas bien, y ten cuidado de no dejarte llevar por las emociones.",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'ja':
      return {
        overallFortune: "今日は創造的なエネルギーに満ちた日です。新しいアイデアが浮かびやすく、直感を信じて行動すれば良い結果を得ることができます。周囲の変化を前向きに受け入れる姿勢が重要です。",
        loveFortune: "感情的な交流が深まる時期です。相手の心を理解しようとする努力が関係発展に大きな助けとなるでしょう。",
        careerFortune: "業務で創造的な解決策を見つけることができる日です。同僚との協力を通じて予想より良い成果を収めることができます。",
        moneyFortune: "慎重な投資判断が必要な時期です。長期的な観点からアプローチすれば安定的な収益を期待できます。",
        healthFortune: "精神的、肉体的バランスがよく合う時期です。規則的な生活パターンを維持すればより良いコンディションを保つことができます。",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["ピンク", "空色", "薄緑", "ラベンダー", "オレンジ"][Math.floor(Math.random() * 5)],
        luckyDirection: ["東北", "西南", "南東", "北西"][Math.floor(Math.random() * 4)],
        todayAdvice: "変化を恐れないでください。今日は新しい機会が訪れる可能性がある日です。開いた心で一日を過ごせば思いがけない良いことが起こるかもしれません。",
        warningAdvice: "性急な判断は禁物です。重要な決定は十分に考えた後に下し、感情に流されないよう注意してください。",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    default: // English
      return {
        overallFortune: "Today is a day full of creative energy. New ideas come easily, and if you act on your intuition, you can achieve good results. It's important to accept changes around you positively.",
        loveFortune: "This is a time when emotional connection deepens. Efforts to understand your partner's heart will greatly help relationship development.",
        careerFortune: "It's a day when you can find creative solutions at work. Through cooperation with colleagues, you can achieve better results than expected.",
        moneyFortune: "This is a time that requires careful investment judgment. If you approach from a long-term perspective, you can expect stable returns.",
        healthFortune: "This is a time when mental and physical balance is well matched. Maintaining regular life patterns will help you maintain better condition.",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["Pink", "Sky blue", "Light green", "Lavender", "Orange"][Math.floor(Math.random() * 5)],
        luckyDirection: ["Northeast", "Southwest", "Southeast", "Northwest"][Math.floor(Math.random() * 4)],
        todayAdvice: "Don't be afraid of change. Today could be a day when new opportunities come. If you spend the day with an open mind, unexpected good things may happen.",
        warningAdvice: "Hasty judgments are forbidden. Make important decisions after sufficient consideration, and be careful not to be swayed by emotions.",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
  }
}