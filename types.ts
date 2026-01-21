export enum PanicStage {
  NORMAL = "NORMAL",
  EARLY = "EARLY",
  SEVERE = "SEVERE",
  DISSOCIATED = "DISSOCIATED"
}

export interface DrugInfo {
  name: string;
  category: string;
  purpose: string;
  effect: string;
  sideEffect: string;
}

export interface PanicSymptom {
  stage: PanicStage;
  title: string;
  description: string[];
  quote: string;
}

export interface TicketTier {
  name: string;
  price: string;
  description: string;
  perk: string;
}
