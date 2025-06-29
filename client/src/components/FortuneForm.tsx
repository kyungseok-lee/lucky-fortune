import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { BirthDateInput } from "@/types/fortune";
import { useTranslation } from 'react-i18next';
// @ts-ignore: no types for solarlunar
import solarlunar from 'solarlunar';

interface FortuneFormProps {
  onSubmit: (birthDate: BirthDateInput, aiModel: AIModel) => void;
  isLoading: boolean;
  showModelSelect?: boolean;
}

type AIModel = 'openai' | 'gemini';

const AI_MODELS: { value: AIModel; label: string; color: string; badge: string }[] = [
  { value: 'openai', label: 'OpenAI GPT-4o', color: 'green', badge: '추천' },
  { value: 'gemini', label: 'Google Gemini', color: 'blue', badge: '신규' },
];
const DEFAULT_AI_MODEL: AIModel = 'gemini';

export default function FortuneForm({ onSubmit, isLoading, showModelSelect = false }: FortuneFormProps) {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState<Partial<BirthDateInput>>({});
  const [aiModel, setAiModel] = useState<AIModel>(DEFAULT_AI_MODEL);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [lunarLeap, setLunarLeap] = useState(false);

  // 날짜 유효성 검증 함수
  const validateDate = (): boolean => {
    if (!birthDate.year || !birthDate.month || !birthDate.day) {
      return false;
    }

    const { year, month, day } = birthDate;
    
    // 기본 범위 검증
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    try {
      if (calendarType === 'solar') {
        // 양력 날짜 유효성 검증
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && 
               date.getMonth() === month - 1 && 
               date.getDate() === day;
      } else {
        // 음력 날짜 유효성 검증
        const maxDays = solarlunar.monthDays(year, month, lunarLeap);
        if (day > maxDays) return false;
        
        // 윤달이 존재하는지 확인
        if (lunarLeap) {
          const leapMonth = solarlunar.leapMonth(year);
          return leapMonth === month;
        }
        return true;
      }
    } catch (error) {
      console.error('Date validation error:', error);
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateDate()) {
      onSubmit(birthDate as BirthDateInput, aiModel);
    }
  };

  const isValid = validateDate();

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  // 음력 월 생성 (윤달 포함)
  const generateLunarMonths = (year: number) => {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      months.push({ month: m, leap: false });
    }
    const leapMonth = solarlunar.leapMonth(year);
    if (leapMonth) {
      months.splice(leapMonth, 0, { month: leapMonth, leap: true });
    }
    return months;
  };

  // 날짜 생성 (음력/양력 분기)
  const generateDays = () => {
    if (!birthDate.year || !birthDate.month) return Array.from({ length: 31 }, (_, i) => i + 1);
    if (calendarType === 'solar') {
      // 기존 양력 로직
      const year = birthDate.year;
      const month = birthDate.month;
      let daysInMonth = 31;
      if ([4, 6, 9, 11].includes(month)) {
        daysInMonth = 30;
      } else if (month === 2) {
        daysInMonth = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
      }
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    } else {
      // 음력: 윤달 여부 고려
      const year = birthDate.year;
      const month = birthDate.month;
      const leap = lunarLeap;
      const daysInMonth = solarlunar.monthDays(year, month, leap);
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-purple-100 shadow-xl">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{t('enterBirth')}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{t('needForAnalysis')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-end">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('calendarType')}</label>
              <Select value={calendarType} onValueChange={(value) => {
                setCalendarType(value as 'solar' | 'lunar');
                // 달력 유형 변경 시 월/일 초기화
                setBirthDate(prev => ({ ...prev, month: undefined, day: undefined }));
                setLunarLeap(false);
              }}>
                <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                  <SelectValue placeholder={t('calendarType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">{t('solar')}</SelectItem>
                  <SelectItem value="lunar">{t('lunar')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('birthYear')}</label>
              <Select value={birthDate.year?.toString()} onValueChange={(value) => {
                const yearValue = parseInt(value);
                
                // 연도 변경 시 현재 월/일이 새로운 연도에서 유효한지 확인
                let newMonth = birthDate.month;
                let newDay = birthDate.day;
                
                if (birthDate.month && birthDate.day) {
                  if (calendarType === 'solar') {
                    // 윤년 변경으로 인한 2월 29일 문제 확인
                    if (birthDate.month === 2 && birthDate.day === 29) {
                      const isLeapYear = (yearValue % 4 === 0 && yearValue % 100 !== 0) || (yearValue % 400 === 0);
                      if (!isLeapYear) {
                        newDay = undefined; // 윤년이 아니면 2월 29일 불가
                      }
                    }
                  } else {
                    // 음력의 경우 해당 연도에 해당 월이 존재하는지 확인
                    try {
                      const monthData = generateLunarMonths(yearValue).find(m => 
                        m.month === birthDate.month && m.leap === lunarLeap
                      );
                      if (!monthData) {
                        // 해당 연도에 윤달이 없는 경우
                        newMonth = undefined;
                        newDay = undefined;
                        setLunarLeap(false);
                      } else if (birthDate.day) {
                        // 일자가 해당 월의 최대 일수를 초과하는지 확인
                        const maxDays = solarlunar.monthDays(yearValue, birthDate.month, lunarLeap);
                        if (birthDate.day > maxDays) {
                          newDay = undefined;
                        }
                      }
                    } catch (error) {
                      // 오류 발생 시 월/일 초기화
                      newMonth = undefined;
                      newDay = undefined;
                    }
                  }
                }
                
                setBirthDate(prev => ({ 
                  ...prev, 
                  year: yearValue,
                  month: newMonth,
                  day: newDay
                }));
              }}>
                <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                  <SelectValue placeholder={t('birthYear')} />
                </SelectTrigger>
                <SelectContent>
                  {generateYears().map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('birthMonth')}</label>
              <Select
                value={birthDate.month?.toString()}
                onValueChange={(value) => {
                  const monthValue = parseInt(value);
                  
                  // 현재 선택된 일자가 새로운 월에 유효한지 확인
                  let newDay = birthDate.day;
                  if (birthDate.year && birthDate.day) {
                    let maxDaysInNewMonth = 31;
                    
                    if (calendarType === 'solar') {
                      // 양력 일수 계산
                      if ([4, 6, 9, 11].includes(monthValue)) {
                        maxDaysInNewMonth = 30;
                      } else if (monthValue === 2) {
                        const year = birthDate.year;
                        maxDaysInNewMonth = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
                      }
                    } else {
                      // 음력 일수 계산
                      try {
                        const monthData = generateLunarMonths(birthDate.year).find(m => m.month === monthValue);
                        const leap = monthData?.leap || false;
                        maxDaysInNewMonth = solarlunar.monthDays(birthDate.year, monthValue, leap);
                        setLunarLeap(leap);
                      } catch (error) {
                        maxDaysInNewMonth = 30; // 기본값
                      }
                    }
                    
                    // 현재 선택된 일자가 새로운 월의 최대 일수를 초과하면 undefined로 설정
                    if (birthDate.day > maxDaysInNewMonth) {
                      newDay = undefined;
                    }
                  }
                  
                  if (calendarType === 'lunar' && !newDay) {
                    // 음력에서 윤달 정보 찾기 (일자가 초기화된 경우에도)
                    const monthData = birthDate.year ? 
                      generateLunarMonths(birthDate.year).find(m => m.month === monthValue) : 
                      { leap: false };
                    setLunarLeap(monthData?.leap || false);
                  }
                  
                  setBirthDate(prev => ({ 
                    ...prev, 
                    month: monthValue,
                    day: newDay
                  }));
                }}
              >
                <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                  <SelectValue placeholder={t('birthMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {calendarType === 'solar'
                    ? generateMonths().map(month => (
                        <SelectItem key={month} value={month.toString()}>{month}</SelectItem>
                      ))
                    : (birthDate.year ? generateLunarMonths(birthDate.year).map(({ month, leap }) => (
                        <SelectItem key={`${month}-${leap}`} value={month.toString()}>
                          {leap ? `${month} (${t('leapMonth')})` : month}
                        </SelectItem>
                      )) : null)
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('birthDay')}</label>
              <Select 
                key={`day-${birthDate.year}-${birthDate.month}-${calendarType}-${lunarLeap}`} 
                value={birthDate.day?.toString() || ""} 
                onValueChange={(value) => setBirthDate(prev => ({ ...prev, day: parseInt(value) }))}
              >
                <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                  <SelectValue placeholder={t('birthDay')} />
                </SelectTrigger>
                <SelectContent>
                  {generateDays().map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {showModelSelect && (
          <div className="mt-6">
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3 text-center">AI 모델 선택</label>
            <Select value={aiModel} onValueChange={(value: AIModel) => setAiModel(value)}>
              <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                <SelectValue placeholder="AI 모델을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center space-x-3 py-1">
                      <div className={`w-3 h-3 bg-${model.color}-500 rounded-full shadow-md`}></div>
                      <span className="font-medium">{model.label}</span>
                      <span className={`text-xs text-gray-500 bg-${model.color}-50 px-2 py-1 rounded-full`}>{model.badge}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className={showModelSelect ? 'mt-8' : 'mt-8'}>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold py-5 sm:py-6 px-6 text-base sm:text-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 rounded-xl"
          >
            <i className="fas fa-sparkles mr-3 text-lg"></i>
            <span className="font-black tracking-wide">
              {t('checkFortune')}
            </span>
          </Button>
          {!isValid && (birthDate.year || birthDate.month || birthDate.day) && (
            <div className="mt-3 text-center">
              <p className="text-red-500 text-sm font-medium">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {!birthDate.year || !birthDate.month || !birthDate.day 
                  ? t('pleaseSelectAllFields')
                  : t('invalidDateSelected')
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
