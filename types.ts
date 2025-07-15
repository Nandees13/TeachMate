export enum Feature {
  QA_GENERATOR,
  NOTE_GENERATOR,
  CONCEPT_EXPLAINER,
  WHITEBOARD,
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ShortAnswerQuestion {
  question: string;
}

export interface QAResponse {
  shortAnswerQuestions: ShortAnswerQuestion[];
  multipleChoiceQuestions: MCQ[];
}

export interface User {
  name: string;
  email: string;
  photoURL?: string;
  department?: string;
  subject?: string;
}
