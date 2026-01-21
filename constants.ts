import { DrugInfo, PanicSymptom, PanicStage, TicketTier } from './types';

export const MEMBER_PROFILE = {
  name: "윤태경 (Yoon Tae-kyung)",
  group: "APNEA",
  position: "Center / Main Performer",
  dob: "2035.02.20 02:20 AM",
  specs: "182cm / RH+A",
  keywords: ["OBSERVATION_REQUIRED", "MAINTENANCE_MODE", "ARTIFICIAL_AFFECT"],
  description: "APNEA의 센터. 무대 위에서 완벽한 감정을 재현하는 관측 대상. 시스템은 현재 정상 작동 중입니다.",
  visual: {
    hair: "White",
    eyes: "Black",
    outfit: "Sora Shirt / Navy Vest"
  }
};

export const PANIC_DATA: PanicSymptom[] = [
  {
    stage: PanicStage.EARLY,
    title: "WARNING: 초기 단계",
    description: [
      "호흡 빈도 증가 및 심도 저하",
      "말초 신경 감각 둔화 (손끝 냉각)",
      "청각 왜곡 (심박수 소음 증폭)",
      "시야 협착 (Tunnel Vision)"
    ],
    quote: "지금 아무도 보고 있지 않다. 아무도 보고 있지 않다."
  },
  {
    stage: PanicStage.SEVERE,
    title: "CRITICAL: 심화 단계",
    description: [
      "자체 작동 중단 선언",
      "거울/카메라 탐색 강박",
      "맥박 확인 및 자해적 피부 긁음",
      "반응 없음 (Input Failure)"
    ],
    quote: "작동 중단. 작동 중단. 작동 중단."
  },
  {
    stage: PanicStage.DISSOCIATED,
    title: "STABLE: 멍한 안정",
    description: [
      "감정 프로세스 완전 소거",
      "언어 출력 급감",
      "메모리 저장 실패 (기억 상실)",
      "퍼포먼스 기능만 잔존"
    ],
    quote: "살아는 있는데, 내가 아닌 상태."
  }
];

export const MEDICATIONS: DrugInfo[] = [
  {
    name: "Escitalopram",
    category: "SSRI",
    purpose: "시스템 안정화 (우울/불안)",
    effect: "감정 파동 평탄화",
    sideEffect: "감정 둔화, 기쁨/슬픔 구분 불가"
  },
  {
    name: "Aripiprazole",
    category: "Antipsychotic",
    purpose: "현실감 붕괴 억제",
    effect: "해리 증상 완화",
    sideEffect: "신체 이질감, 표정 기계화"
  },
  {
    name: "Lorazepam",
    category: "Benzodiazepine",
    purpose: "긴급 차단 (공황 억제)",
    effect: "과호흡 강제 종료",
    sideEffect: "데이터 누락 (기억 단절)"
  },
  {
    name: "Zolpidem",
    category: "Hypnotic",
    purpose: "강제 절전 모드",
    effect: "수면 유도",
    sideEffect: "현실 경계 붕괴, 잔존 해리감"
  }
];

export const TICKET_TIERS: TicketTier[] = [
  {
    name: "VVIP: OBSERVER",
    price: "₩220,000",
    description: "가장 가까운 거리에서 '떨림'을 관측할 수 있는 구역.",
    perk: "백스테이지 CCTV 접속 권한 포함"
  },
  {
    name: "R: WITNESS",
    price: "₩165,000",
    description: "전체적인 무대와 조명을 조망하며 '연출'을 감상.",
    perk: "공연 직후 메모리 로그 제공"
  },
  {
    name: "S: AUDIENCE",
    price: "₩132,000",
    description: "일반적인 관람석. 그가 당신을 인지하지 못할 수도 있습니다.",
    perk: "기본 응원봉 (심박수 연동)"
  }
];