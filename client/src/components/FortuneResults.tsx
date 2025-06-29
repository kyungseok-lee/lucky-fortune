import { Card, CardContent } from "@/components/ui/card";
import { FortuneData, FortuneCategory } from "@/types/fortune";
import { getStarRating } from "@/lib/fortune";
import ShareButtons from "./ShareButtons";
import AdBanner from "./AdBanner";
import { useTranslation } from "react-i18next";

interface FortuneResultsProps {
  fortune: FortuneData;
}

export default function FortuneResults({ fortune }: FortuneResultsProps) {
  const { t } = useTranslation();
  console.log("FortuneResults received data:", fortune);

  // 데이터 유효성 검사
  if (!fortune) {
    console.error("Fortune data is null or undefined");
    return <div>{t("fortuneDataLoadError")}</div>;
  }
  const categories: FortuneCategory[] = [
    {
      id: "love",
      name: t("love"),
      icon: "fas fa-heart",
      score: fortune.loveScore,
      content: fortune.loveFortune,
      color: "pink",
    },
    {
      id: "career",
      name: t("career"),
      icon: "fas fa-briefcase",
      score: fortune.careerScore,
      content: fortune.careerFortune,
      color: "blue",
    },
    {
      id: "money",
      name: t("money"),
      icon: "fas fa-coins",
      score: fortune.moneyScore,
      content: fortune.moneyFortune,
      color: "green",
    },
    {
      id: "health",
      name: t("health"),
      icon: "fas fa-heartbeat",
      score: fortune.healthScore,
      content: fortune.healthFortune,
      color: "red",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: "bg-pink-100 text-pink-500",
      blue: "bg-blue-100 text-blue-500",
      green: "bg-green-100 text-green-500",
      red: "bg-red-100 text-red-500",
    };
    return (
      colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-500"
    );
  };

  const getStarColor = (color: string) => {
    const colorMap = {
      pink: "text-pink-400",
      blue: "text-blue-400",
      green: "text-green-400",
      red: "text-red-400",
    };
    return colorMap[color as keyof typeof colorMap] || "text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Overall Fortune Card */}
      <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
              {t("overall")}
            </h3>
            <div className="flex space-x-1">
              {getStarRating(fortune.overallScore).map((starClass, index) => (
                <i
                  key={index}
                  className={`${starClass} text-yellow-100 text-lg drop-shadow-md`}
                ></i>
              ))}
            </div>
          </div>
          <p className="text-lg font-medium mb-6 leading-relaxed text-white drop-shadow-sm">
            {fortune.overallFortune}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-sm text-yellow-100 font-medium mb-1">
                {t("luckyNumber")}
              </div>
              <div className="text-2xl font-bold text-white">
                {fortune.luckyNumber}
              </div>
            </div>
            <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-sm text-yellow-100 font-medium mb-1">
                {t("luckyColor")}
              </div>
              <div className="text-lg font-bold text-white">
                {fortune.luckyColor}
              </div>
            </div>
            <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-sm text-yellow-100 font-medium mb-1">
                {t("luckyDirection")}
              </div>
              <div className="text-lg font-bold text-white">
                {fortune.luckyDirection}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fortune Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`w-14 h-14 ${getColorClasses(
                    category.color
                  )} rounded-full flex items-center justify-center mr-4 shadow-md`}
                >
                  <img src="/clover.png" alt="Clover" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h4>
                  <div className="flex space-x-1 mt-1">
                    {getStarRating(category.score).map((starClass, index) => (
                      <i
                        key={index}
                        className={`${starClass} ${getStarColor(
                          category.color
                        )} text-base`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base font-medium">
                {category.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advice Section */}
      <Card className="border-2 border-yellow-200">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-lightbulb text-yellow-500 mr-3 text-2xl"></i>
            {t("advice")}
          </h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-sm">
            <p className="text-gray-800 leading-relaxed text-lg font-medium">
              {fortune.todayAdvice}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning Section */}
      <Card className="border-2 border-orange-200">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-exclamation-triangle text-orange-500 mr-3 text-2xl"></i>
            {t('warning')}
          </h3>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm">
            <p className="text-gray-800 leading-relaxed text-lg font-medium">
              {fortune.warningAdvice}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('shareWithFriends')}
          </h3>
          <ShareButtons />
        </CardContent>
      </Card>

      {/* Bottom Ad Banner */}
      <AdBanner position="bottom" />
    </div>
  );
}
