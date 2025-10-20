import httpClient from '../httpClient';
import {
  type Questionnaire,
  type SubmitQuestionnaireDto,
  type QuestionnaireAnswersResponse,
  type VisibleQuestionsResponse,
} from './questions.types';

// Get registration questionnaires (public, no auth required)
export const getRegistrationQuestionnaires = async (): Promise<
  Questionnaire[]
> => {
  const response = await httpClient.get('/user/questionnaire/registration');
  return response.data;
};

// Get all active questionnaires
export const getActiveQuestionnaires = async (): Promise<Questionnaire[]> => {
  const response = await httpClient.get('/user/questionnaire/active');
  return response.data;
};

// Get all required questionnaires
export const getRequiredQuestionnaires = async (): Promise<Questionnaire[]> => {
  const response = await httpClient.get('/user/questionnaire/required');
  return response.data;
};

// Get a single questionnaire
export const getQuestionnaire = async (id: number): Promise<Questionnaire> => {
  const response = await httpClient.get(`/user/questionnaire/${id}`);
  return response.data;
};

// Get visible questions based on current answers
export const getVisibleQuestions = async (
  id: number
): Promise<VisibleQuestionsResponse> => {
  const response = await httpClient.get(
    `/user/questionnaire/${id}/visible-questions`
  );
  return response.data;
};

// Submit answers to a questionnaire
export const submitQuestionnaireAnswers = async (
  data: SubmitQuestionnaireDto
): Promise<{ message: string }> => {
  const response = await httpClient.post('/user/questionnaire/submit', data);
  return response.data;
};

// Get user's answers for a questionnaire
export const getMyAnswers = async (
  id: number
): Promise<QuestionnaireAnswersResponse> => {
  const response = await httpClient.get(`/user/questionnaire/${id}/my-answers`);
  return response.data;
};

// Check if questionnaire is completed
export const checkQuestionnaireCompleted = async (
  id: number
): Promise<{ completed: boolean }> => {
  const response = await httpClient.get(`/user/questionnaire/${id}/completed`);
  return response.data;
};
