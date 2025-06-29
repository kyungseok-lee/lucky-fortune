import { Card } from "@/components/ui/card";

interface AdBannerProps {
  position: "top" | "bottom" | "sidebar";
  className?: string;
}

export default function AdBanner({ position, className = "" }: AdBannerProps) {
  const getAdSize = () => {
    switch (position) {
      case "top":
        return "h-24 md:h-32";
      case "bottom":
        return "h-32 md:h-40";
      case "sidebar":
        return "h-64 w-full";
      default:
        return "h-32";
    }
  };

  return (
    <Card className={`bg-gray-100 border-2 border-dashed border-gray-300 ${getAdSize()} ${className}`}>
      <div className="h-full flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 text-sm text-center mb-2">
          {/* Google AdSense 광고 영역 */}
        </p>
        <div className="text-xs text-gray-400">AD</div>
      </div>
    </Card>
  );
}
