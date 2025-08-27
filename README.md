# 모여봐요 정보섬 🏝️

![University](https://img.shields.io/badge/University-Soongsil-blue)

<div align="center">

### Frontend
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A8?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

### AI/ML
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white)

### Infrastructure & Tools
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

</div>


## 🔗 Pillink

> **"고령층의 복약 관리와 약물 상호작용을 가족이 실시간으로 모니터링하고 지원하는 헬스케어 앱"**

### 🎯 Problem & Solution

**Problem**: 
- 🧓 65세 이상 시니어 다약제 복용률 높아 약물 부작용·상호작용 및 복용 누락 위험 증가
- 📊 75세 이상 노인 중 70.2%가 3개월 이상 5개 이상의 약물을 만성 복용 (OECD 최고수준)
- 👨‍👩‍👧‍👦 서로 다른 의료기관 처방으로 통합 관리 부재, 가족·의료진이 실시간 확인 어려움

**Solution**: 
AI 기반 약물 상호작용 분석과 보호자-대상자 실시간 연동을 통한 **안전하고 지속적인 복약 관리 플랫폼**

### 🏗 아키텍처 요약

```
┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐
│   Frontend      │───▶│     Backend     │───▶│   Flask Service    │
│ (React Native)  │    │    (Nest.js)    │    │     (Python)       │
│                 │    │                 │    │                    │
│ • User Interface│    │ • RESTful API   │    │ • AI Analysis      │
│ • Responsive UI │    │ • Auth & Roles  │    │ • Interaction Check│
└─────────────────┘    └─────────────────┘    └────────────────────┘
```

---

## 🎪 상세 기획

### 💡 핵심 아이디어 

**"시니어 복약 관리 + 가족 연동 + AI 위험도 분석"**

40-50대 보호자가 70-80대 부모님의 복약을 원격으로 안전하게 관리할 수 있는 차세대 헬스케어 솔루션

### 🔍 타겟 사용자

#### 1차 타겟: 보호자 (40-50대)
- **페르소나**: 김미영 (50세, 중견기업 정규직)
- **상황**: 75세 부모님 (고혈압·당뇨 복합), 직장-가정 병행으로 원거리 부모 건강관리 어려움
- **니즈**: 실시간 건강 상태 확인 수단 절실히 필요

#### 2차 타겟: 보호 대상자 (70-80대)
- **상황**: 다량의 약물 복용, 복용 시간 및 순서 혼란 빈번
- **니즈**: 간단하고 직관적인 복약 알림 시스템

### 🚀 핵심 기능 상세

#### 1. **복용 검증 캘린더**
- **보호대상자**: 해당 캘린더를 통해 자신의 알약 섭취 사실을 기억 가능
- **보호자**: 보호대상자의 복용 여부를 캘린더를 통해 실시간 확인
- **실시간 동기화**: 복용 완료 시 즉시 보호자에게 알림 전송

#### 2. **AI 기반 위험도 시각화**
- **색상 코딩 시스템**:
  - 🟢 **안전 (0점)**: "현재 약물 상호작용에 문제가 없습니다"
  - 🟡 **주의 (1-33점)**: "상호작용 위험 존재, 의사·약사 상담 고려"
  - 🟠 **경고 (34-66점)**: "위험 점수 높음, 약물 변경 또는 중단 상담 필요"
  - 🔴 **위험 (67-100점)**: "즉시 의료진과 상담 필요"
- **원형 게이지**: 인지능력이 떨어지는 고령층도 쉽게 이해 가능한 직관적 UI

#### 3. **상호작용 분석 리포트**
- **MVP 단계**: 공공 데이터(KPIC) 기반 기본 상호작용 분석 제공
- **고도화 단계**: 머신러닝 기반 개인 맞춤 예측 기능
- **실시간 분석**: 새로운 약물 추가 시 즉시 위험도 재계산

#### 4. **보호자-보호대상자 상호 연동 시스템**
- **약물 리스트 관리**: 보호자가 보호대상자의 모든 약물 정보 통합 관리
- **알람 설정**: 약물별 개별 복용 알람 스케줄링
- **복용 확인**: 설정된 알람 → 보호대상자 복용 → 보호자 확인 워크플로우

#### 5. **스마트 약물 등록**
- **OCR 기반 처방전 인식**: 처방전 촬영으로 약물 정보 자동 추출
- **AI 라벨 인식**: 약통 사진 촬영으로 약명, 용법, 용량 자동 등록
- **약품 검색**: 식품의약품안전처 API 연동 실시간 검색

#### 6. **AI 챗봇 상담**
- **Hybrid 구조**: 규칙 기반 + AI 챗봇 결합
- **3단계 질의응답**:
  - 사용 문의 → 사전 작성된 FAQ (규칙 기반)
  - 약 관련 질문 → koBERT + 식약처 API
  - 개인 프로필 문의 → 사용자 DB 연동

### 🎨 UX/UI 설계 철학

#### **시니어 중심 UX**
- **이중 모드 설계**: 보호자와 보호대상자 각각 최적화된 별도 인터페이스
- **보호대상자 모드**: 홈화면 + 알람화면 단순 구성, 모바일 앱 사용 미숙자도 쉽게 이용
- **색상 대조**: 시니어 색상 구별 능력 고려한 명확한 대비 (회색/파란색/빨간색)

#### **핵심 화면 구성**
1. **온보딩**: 보호자/보호대상자 역할 선택
2. **프로필 선택**: 넷플릭스 스타일 다중 프로필 관리
3. **홈 대시보드**: 복용 현황 캘린더 + 위험도 게이지
4. **약물 관리**: 복용 중인 약물 리스트 + 추가/수정 기능
5. **리포트**: 상호작용 분석 결과 + 의료진 상담 권장사항

---

## 📂 레포지토리 구조

### 🗂 레포지토리

<table>
<tr>
<td width="50%">

#### 🎨 프론트엔드
**[Pillink](https://github.com/ssu-unithon/Pillink)**
- **Language**: TypeScript + React Native
- **Features**: 시니어 친화적 UI, 실시간 동기화
- **핵심 화면**: 복용 캘린더, 위험도 대시보드

</td>
<td width="50%">

#### ⚙️ 백엔드
**[Pillink-Backend](https://github.com/ssu-unithon/Pillink-Backend)**  
- **Language**: TypeScript + NestJS
- **Features**: 
  - 사용자 인증 및 가족 그룹 관리
  - 약물 데이터 CRUD 및 복용 기록
  - 실시간 알림 시스템

</td>
</tr>
<tr>
<td width="50%">

#### 🐍 AI 분석 서비스
**[Pillink-Flask](https://github.com/ssu-unithon/Pillink-Flask)**
- **Language**: Python + Flask
- **AI Features**: 
  - 🧠 **약물 상호작용 분석** (KPIC 데이터 기반)
  - 🎯 **위험도 스코어링** (머신러닝 모델)
  - 🔍 **자연어 처리** (koBERT 기반 챗봇)
  - 📊 **개인화 추천** (복용 패턴 학습)

</td>
</tr>
</table>

---

## 🎨 스크린샷

### 🏠 홈
<div align="center">
  <img src="/screenshots/home.png" width="30%" alt="홈">
</div>

### 📈 리포트
<div align="center">
  <img src="/screenshots/report.png" width="30%" alt="리포트">
</div>

### 💬 AI 챗봇
<div align="center">
  <img src="/screenshots/chat.png" width="30%" alt="AI 챗봇">
</div>

### 🧑‍🧑‍🧒‍🧒 가족 구성원 관리
<div align="center">
  <img src="/screenshots/managing.png" width="30%" alt="가족 구성원 관리">
  <img src="/screenshots/medicine.png" width="30%" alt="구성원 약물 관리">
</div>

---

## 👥 Team 모여봐요 정보섬

| Role | Name | Contribution & Expertise |
|------|------|-------------------------|
| **PM** | **남지윤** | 프로젝트 전략 기획, 팀 협업 조율, 요구사항 분석<br>• 시장분석 및 사업계획서 작성<br>• 개발 일정 관리 및 품질 관리 |
| **Designer** | **유은정** | UI/UX 디자인 시스템, 사용자 리서치, 브랜드 아이덴티티<br>• 시니어 친화적 UX 설계<br>• 직관적 색상 시스템 및 아이콘 디자인 |
| **Frontend Lead** | **홍준우** | React Native 개발, 모바일 앱 아키텍처<br>• 크로스플랫폼 모바일 애플리케이션 구현<br>• 실시간 데이터 바인딩 및 상태 관리 |
| **Backend Lead** | **이재헌** | NestJS API 서버, 데이터베이스 스키마 설계<br>• RESTful API 및 실시간 알림 시스템<br>• 가족 그룹 관리 및 권한 시스템 |
| **AI Lead** | **이수아** | Python Flask ML 서비스, 자연어 처리<br>• KPIC 데이터 기반 약물 상호작용 분석<br>• OCR 및 koBERT 챗봇 개발 |

---

## 🏆 성과 및 학습

### 📊 정량적 성과

**개발 성과**:
- ⏱️ **5일 집중개발**: 기획부터 배포까지 완전한 서비스 구현
- 🖥️ **4개 독립 서비스**: Frontend, Backend, AI 각각 배포 완료
- 📱 **12개 핵심 화면**: 온보딩부터 리포트까지 완전한 사용자 여정 구현
- 🔗 **15개 API 엔드포인트**: 인증, 약물관리, 가족연동, 알림, 챗봇 등 구현
- 🧠 **3개 AI 모듈**: OCR, 상호작용 분석, NLP 챗봇 통합

**기획 완성도**:
- 📈 **시장규모 분석**: TAM 350만명, SAM 255만명, SOM 12.7만명
- 💰 **수익모델 설계**: B2C 구독제 + B2B 제휴 + 데이터 수익화
- 🎯 **경쟁분석**: 기존 3개 주요 서비스 대비 4개 차별화 요소 도출
- 📋 **사업계획**: 5개 단계별 성장전략 및 자금조달 계획 수립

### 🎓 질적 성장

**기술적 역량**:
- **시스템 설계 능력**: 복잡한 헬스케어 도메인을 명확한 서비스 아키텍처로 구현
- **AI 실전 적용**: 학술적 지식을 실제 사용자 문제 해결에 활용
- **풀스택 개발**: 각자의 전문 영역에서 전체 시스템에 기여하는 통합적 사고

**협업 및 소통**:
- **애자일 방법론**: 짧은 스프린트와 지속적인 피드백을 통한 빠른 개발
- **의사결정 과정**: 기술적 제약과 사용자 니즈 사이의 균형점 찾기
- **위기관리**: 개발 중 발생한 기술적 이슈들을 팀워크로 신속하게 해결

---

*Made with ❤️ by Team 모여봐요 정보섬*  
*UNITHON 2025 • Soongsil University IT College*  
*Connect. Create. Change.*

![Wave Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)

</div>
