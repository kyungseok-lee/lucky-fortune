import { FortuneData, BirthDateInput } from "@/types/fortune";
import { generateFortune } from "./openai";
import { generateFortuneWithGemini } from "./gemini";
import { saveFortuneToStorage, getFortuneFromStorage } from "./storage";

export async function getFortune(birthDate: BirthDateInput, aiModel: 'openai' | 'gemini' = 'openai'): Promise<FortuneData> {
  const today = new Date().toISOString().split('T')[0];
  const birthKey = `${birthDate.year}-${birthDate.month}-${birthDate.day}-${aiModel}`;
  
  // 오늘 이미 생성된 운세가 있는지 확인
  const cachedFortune = getFortuneFromStorage(birthKey, today);
  if (cachedFortune) {
    return cachedFortune;
  }

  // 새로운 운세 생성
  let fortuneData;
  try {
    if (aiModel === 'gemini') {
      console.log('Generating fortune with Gemini...');
      fortuneData = await generateFortuneWithGemini({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day,
        currentDate: today
      });
    } else {
      console.log('Generating fortune with OpenAI...');
      fortuneData = await generateFortune({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day,
        currentDate: today
      });
    }

    console.log('Fortune data received:', fortuneData);

    // 로컬 스토리지에 저장
    saveFortuneToStorage(birthKey, today, fortuneData);
    
    return fortuneData;
  } catch (error) {
    console.error('Error generating fortune:', error);
    throw error;
  }
}

export function getFortuneColor(score: number): string {
  if (score >= 4) return "from-fortune-gold to-traditional-gold";
  if (score >= 3) return "from-blue-500 to-blue-600";
  return "from-gray-500 to-gray-600";
}

export function getStarRating(score: number): string[] {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= score ? "fas fa-star" : "far fa-star");
  }
  return stars;
}
