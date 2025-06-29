import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { BirthDateInput } from "@/types/fortune";
import { useTranslation } from 'react-i18next';

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

  const handleSubmit = () => {
    if (birthDate.year && birthDate.month && birthDate.day) {
      onSubmit(birthDate as BirthDateInput, aiModel);
    }
  };

  const isValid = birthDate.year && birthDate.month && birthDate.day;

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

  const generateDays = () => {
    if (!birthDate.year || !birthDate.month) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const daysInMonth = new Date(birthDate.year, birthDate.month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-purple-100 shadow-xl">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{t('enterBirth')}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{t('needForAnalysis')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('birthYear')}</label>
              <Select value={birthDate.year?.toString()} onValueChange={(value) => setBirthDate(prev => ({ ...prev, year: parseInt(value) }))}>
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
              <Select value={birthDate.month?.toString()} onValueChange={(value) => setBirthDate(prev => ({ ...prev, month: parseInt(value) }))}>
                <SelectTrigger className="bg-white shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors h-12 sm:h-14">
                  <SelectValue placeholder={t('birthMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {generateMonths().map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">{t('birthDay')}</label>
              <Select value={birthDate.day?.toString()} onValueChange={(value) => setBirthDate(prev => ({ ...prev, day: parseInt(value) }))}>
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
        </div>
      </CardContent>
    </Card>
  );
}
