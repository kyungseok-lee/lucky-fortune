# Lucky Fortune

AI 기반 운세 생성 서비스

## 소개

Lucky Fortune은 OpenAI 및 Google Gemini API를 활용하여 사용자의 운세를 생성해주는 웹 서비스입니다.

## 주요 기능
- 생년월일 입력 시 AI가 오늘의 운세를 분석
- Gemini AI를 기본으로 사용 (모델 선택 옵션화, UI는 기본 숨김)
- 결과 공유: 페이스북, 카카오톡(노란색 공식 컬러, JS SDK 연동), 링크 복사
- 로딩 중 에너지 파동/로딩바 등 동적 애니메이션
- 반응형 UI, 접근성, 한국어 최적화
- 브랜드/신뢰감 있는 푸터 (GitHub, 이메일)

## 기술 스택

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, TypeScript, Express 스타일 서버, Drizzle ORM
- **Database**: (예: PostgreSQL)
- **AI**: OpenAI, Google Gemini API

## 폴더 구조

```
lucky-fortune/
  client/      # 프론트엔드 소스
  server/      # 백엔드 소스
  shared/      # 공용 타입/스키마
```

## 설치 및 실행

1. 저장소 클론
   ```sh
   git clone https://github.com/kyungseok-lee/lucky-fortune.git
   cd lucky-fortune
   ```

2. 의존성 설치
   ```sh
   npm install
   ```

3. 환경 변수 설정
   ```sh
   cp .env.example .env
   # .env 파일을 열어 실제 값을 입력하세요.
   ```

4. 개발 서버 실행 (기본 포트: 3000)
   ```sh
   npm run dev
   ```

## 환경 변수 설정 (.env)

이 프로젝트는 민감한 정보를 .env 파일로 관리합니다. 아래 예시를 참고하여 프로젝트 루트에 .env 파일을 생성하세요.

.env.example 파일을 참고하여 필요한 값을 입력하면 됩니다.

### 주요 환경 변수

| 키                | 설명                        | 예시 값                                  |
|-------------------|-----------------------------|------------------------------------------|
| OPENAI_API_KEY    | OpenAI API 키               | your-openai-api-key                      |
| GEMINI_API_KEY    | Google Gemini API 키        | your-gemini-api-key                      |
| DATABASE_URL      | 데이터베이스 접속 URL       | postgres://user:password@host:port/dbname|
| NODE_ENV          | Node 실행 환경              | development                              |

.env.example 파일을 복사하여 .env 파일로 사용하세요:

```sh
cp .env.example .env
```

## 카카오톡 공유 연동
- `client/index.html`의 `<head>`에 아래 스크립트 추가:
  ```html
  <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js" crossorigin="anonymous"></script>
  ```
- 카카오 JS SDK 초기화 및 공유 함수는 `ShareButtons.tsx` 참고
- 버튼 색상: `#FEE500` (카카오 공식 노란색)
- [카카오 JS SDK 가이드](https://developers.kakao.com/docs/latest/ko/message/js)

## 커스터마이징/확장
- AI 모델 선택 UI: `FortuneForm`의 `showModelSelect` 옵션으로 on/off
- 공유 버튼, 푸터, 로딩 애니메이션 등 컴포넌트별 커스터마이징 용이

## 푸터 정보
- GitHub: [https://github.com/kyungseok-lee](https://github.com/kyungseok-lee)
- Email: meant0415@gmail.com

## API 문서

- 추후 OpenAPI/Swagger 문서로 자동 생성 예정

## 테스트

- (예시) 단위 테스트: `npm test`
- (예시) 통합 테스트: `npm run test:integration`

## 배포

- (예시) Vercel, AWS, Docker 등 배포 방법 안내

## 라이선스

MIT 