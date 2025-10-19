// Question Types
export enum QuestionType {
  OPEN_TEXT = 'open_text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SELECT = 'select',
}

// Conditional Logic Types
export type ConditionOperator =
  | 'answered'
  | 'not_answered'
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains';

export interface SingleCondition {
  questionId: number;
  operator: ConditionOperator;
  selectedOptionIds?: number[];
  textValue?: string;
}

export interface QuestionCondition {
  logic: 'AND' | 'OR';
  conditions: SingleCondition[];
}

// Question Option
export interface QuestionOption {
  id: number;
  optionText: string;
  order: number;
}

// Question
export interface Question {
  id: number;
  questionText: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  helpText?: string;
  showIf?: QuestionCondition;
  options?: QuestionOption[];
}

// Questionnaire
export interface Questionnaire {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

// Answer Types
export interface SubmitAnswerDto {
  questionId: number;
  textAnswer?: string;
  selectedOptionIds?: number[];
}

export interface SubmitQuestionnaireDto {
  questionnaireId: number;
  answers: SubmitAnswerDto[];
}

// User Answer Response
export interface UserAnswer {
  id: number;
  questionId: number;
  textAnswer?: string;
  selectedOptions?: QuestionOption[];
}

export interface QuestionnaireAnswersResponse {
  questionnaireId: number;
  userId: number;
  answers: UserAnswer[];
  completedAt?: string;
}

// Visible Questions Response
export interface VisibleQuestionsResponse {
  questionnaireId: number;
  visibleQuestions: Question[];
  reason: string;
}
