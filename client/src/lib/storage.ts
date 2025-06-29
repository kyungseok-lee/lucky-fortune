import { FortuneData } from "@/types/fortune";

const FORTUNE_STORAGE_KEY = "daily_fortunes";

interface StoredFortune {
  date: string;
  data: FortuneData;
}

interface FortuneStorage {
  [birthKey: string]: StoredFortune;
}

export function saveFortuneToStorage(birthKey: string, date: string, fortune: FortuneData): void {
  try {
    const storage = getStorage();
    storage[birthKey] = {
      date,
      data: fortune
    };
    localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error("운세 저장 오류:", error);
  }
}

export function getFortuneFromStorage(birthKey: string, date: string): FortuneData | null {
  try {
    const storage = getStorage();
    const stored = storage[birthKey];
    
    if (stored && stored.date === date) {
      return stored.data;
    }
    
    return null;
  } catch (error) {
    console.error("운세 불러오기 오류:", error);
    return null;
  }
}

function getStorage(): FortuneStorage {
  try {
    const stored = localStorage.getItem(FORTUNE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("스토리지 파싱 오류:", error);
    return {};
  }
}

export function clearOldFortunes(): void {
  try {
    const storage = getStorage();
    const today = new Date().toISOString().split('T')[0];
    const updated: FortuneStorage = {};
    
    // 오늘 날짜의 운세만 유지
    Object.keys(storage).forEach(key => {
      if (storage[key].date === today) {
        updated[key] = storage[key];
      }
    });
    
    localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("오래된 운세 정리 오류:", error);
  }
}
