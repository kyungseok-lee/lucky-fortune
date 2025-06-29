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
  const lang = i18n?.language || 'en';
  
  switch (lang) {
    case 'ko':
      return {
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
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'zh':
    case 'zh-CN':
      return {
        overallFortune: "今天总体上是好气运流淌的一天。适合新的开始，以积极的心态度过一天，会得到好结果。与周围人的关系中也有很强的和谐气运。",
        loveFortune: "爱情运势非常明朗。如果有恋人，可以感受到更深的纽带，如果是单身，可能会有新的相遇机会。",
        careerFortune: "在职场会有被认可的机会。平时准备的工作会发光发热，请充满自信地去做。",
        moneyFortune: "财务上会是稳定的一天。投资或重要决定要谨慎，但不要错过小机会。",
        healthFortune: "整体状态很好。但要避免过劳，请充分休息。",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["红色", "蓝色", "黄色", "绿色", "紫色"][Math.floor(Math.random() * 5)],
        luckyDirection: ["东", "西", "南", "北"][Math.floor(Math.random() * 4)],
        todayAdvice: "今天是开始新挑战的好日子。不要害怕，一步一步前进。倾听周围人的建议会得到更好的结果。",
        warningAdvice: "避免情绪化的决定，重要的事情要充分检讨后进行。也要注意健康管理。",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'es':
      return {
        overallFortune: "Hoy es un día en el que fluye una buena energía en general. Es un momento adecuado para nuevos comienzos, y si pasas el día con una mentalidad positiva, podrás obtener buenos resultados. También hay una fuerte energía de armonía en las relaciones con las personas cercanas.",
        loveFortune: "La fortuna amorosa es muy brillante. Si tienes pareja, podrás sentir un vínculo más profundo, y si estás soltero, puede llegar una oportunidad de nuevo encuentro.",
        careerFortune: "Tendrás la oportunidad de ser reconocido en el trabajo. Es momento de que brillen las cosas que has estado preparando, así que afróntalas con confianza.",
        moneyFortune: "Será un día estable financieramente. Sé prudente con las inversiones o decisiones importantes, pero no pierdas las pequeñas oportunidades.",
        healthFortune: "Tu condición general es buena. Sin embargo, evita el exceso de trabajo y descansa lo suficiente.",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["Rojo", "Azul", "Amarillo", "Verde", "Morado"][Math.floor(Math.random() * 5)],
        luckyDirection: ["Este", "Oeste", "Sur", "Norte"][Math.floor(Math.random() * 4)],
        todayAdvice: "Hoy es un buen día para comenzar nuevos desafíos. No tengas miedo y avanza paso a paso. Si escuchas los consejos de las personas cercanas, podrás obtener mejores resultados.",
        warningAdvice: "Evita las decisiones emocionales y procede con asuntos importantes después de revisarlos suficientemente. También cuida tu salud.",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    case 'ja':
      return {
        overallFortune: "今日は全般的に良い気運が流れる日です。新しい始まりに適した時で、前向きな心持ちで一日を過ごせば良い結果を得ることができるでしょう。周囲の人々との関係でも調和の気運が強いです。",
        loveFortune: "愛情運勢がとても明るいです。恋人がいるならより深い絆を感じることができ、独身なら新しい出会いの機会が訪れるかもしれません。",
        careerFortune: "職場で認められる機会が生まれるでしょう。普段準備してきたことが光る時なので、自信を持って臨んでください。",
        moneyFortune: "金銭的に安定した一日になるでしょう。投資や重要な決定は慎重にしつつ、小さな機会を逃さないでください。",
        healthFortune: "全般的なコンディションが良いです。ただし過労は避け、十分な休息を取ってください。",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["赤", "青", "黄", "緑", "紫"][Math.floor(Math.random() * 5)],
        luckyDirection: ["東", "西", "南", "北"][Math.floor(Math.random() * 4)],
        todayAdvice: "今日は新しい挑戦を始めるのに良い日です。恐れずに一歩ずつ進んでください。周囲の人々のアドバイスに耳を傾ければより良い結果を得ることができます。",
        warningAdvice: "感情的な決定は避け、重要なことは十分に検討してから進めてください。健康管理にも気を付けてください。",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
    default: // English
      return {
        overallFortune: "Today is a day when good energy flows overall. It's a time suitable for new beginnings, and if you spend the day with a positive mindset, you'll be able to achieve good results. There's also strong harmonious energy in relationships with people around you.",
        loveFortune: "Love fortune is very bright. If you have a partner, you can feel a deeper bond, and if you're single, a new meeting opportunity may come.",
        careerFortune: "You will have an opportunity to be recognized at work. It's time for the things you've been preparing to shine, so approach them with confidence.",
        moneyFortune: "It will be a financially stable day. Be prudent with investments or important decisions, but don't miss small opportunities.",
        healthFortune: "Your overall condition is good. However, avoid overwork and get sufficient rest.",
        luckyNumber: Math.floor(Math.random() * 9) + 1,
        luckyColor: ["Red", "Blue", "Yellow", "Green", "Purple"][Math.floor(Math.random() * 5)],
        luckyDirection: ["East", "West", "South", "North"][Math.floor(Math.random() * 4)],
        todayAdvice: "Today is a good day to start new challenges. Don't be afraid and move forward step by step. If you listen to advice from people around you, you can get better results.",
        warningAdvice: "Avoid emotional decisions and proceed with important matters after sufficient review. Also take care of your health.",
        overallScore: Math.floor(Math.random() * 2) + 4,
        loveScore: Math.floor(Math.random() * 3) + 3,
        careerScore: Math.floor(Math.random() * 2) + 4,
        moneyScore: Math.floor(Math.random() * 3) + 3,
        healthScore: Math.floor(Math.random() * 2) + 4
      };
  }
}
