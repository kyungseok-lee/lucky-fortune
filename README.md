# 🍀 Lucky Fortune

> AI 기반 개인 맞춤형 운세 서비스

Lucky Fortune은 AI를 활용하여 사용자의 생년월일을 기반으로 개인화된 운세를 제공하는 웹 애플리케이션입니다. 
다국어 지원과 반응형 디자인을 통해 전 세계 사용자에게 접근 가능한 서비스를 제공합니다.

## ✨ 주요 기능

- **AI 기반 운세 생성**: OpenAI GPT와 Google Gemini를 활용한 고품질 운세 분석
- **개인화된 분석**: 생년월일을 기반으로 한 맞춤형 운세 제공
- **다양한 운세 카테고리**: 총운, 애정운, 직장운, 금전운, 건강운 등 상세 분석
- **다국어 지원**: 한국어, 영어, 중국어, 스페인어, 일본어 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스 (Neon Database 권장)

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=your_postgresql_connection_string

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost
```

### 3. 데이터베이스 설정
```bash
# 데이터베이스 스키마 적용
npm run db:push
```

### 4. 개발 서버 실행
```bash
# 개발 모드 실행 (프론트엔드 + 백엔드)
npm run dev
```

### 5. 프로덕션 빌드
```bash
# 전체 애플리케이션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🧪 개발 도구

```bash
# 타입 체크
npm run check

# 데이터베이스 스키마 적용
npm run db:push
```

## 🚀 배포

### Vercel 배포 (권장)
1. Vercel 계정에 GitHub 저장소 연결
2. 환경 변수 설정
3. 자동 배포 설정

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.