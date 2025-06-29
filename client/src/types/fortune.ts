export interface FortuneData {
  overallFortune: string;
  loveFortune: string;
  careerFortune: string;
  moneyFortune: string;
  healthFortune: string;
  luckyNumber: number;
  luckyColor: string;
  luckyDirection: string;
  todayAdvice: string;
  warningAdvice: string;
  overallScore: number;
  loveScore: number;
  careerScore: number;
  moneyScore: number;
  healthScore: number;
}

export interface BirthDateInput {
  year: number;
  month: number;
  day: number;
}

export interface FortuneCategory {
  id: string;
  name: string;
  icon: string;
  score: number;
  content: string;
  color: string;
}
