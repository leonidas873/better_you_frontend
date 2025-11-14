import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRegistrationQuestionnaires,
  getActiveQuestionnaires,
  getRequiredQuestionnaires,
  getQuestionnaire,
  getVisibleQuestions,
  submitQuestionnaireAnswers,
  getMyAnswers,
  checkQuestionnaireCompleted,
} from './questions.api';
import { type SubmitQuestionnaireDto } from './questions.types';

// Query Keys
export const questionnaireKeys = {
  all: ['questionnaires'] as const,
  registration: () => [...questionnaireKeys.all, 'registration'] as const,
  active: () => [...questionnaireKeys.all, 'active'] as const,
  required: () => [...questionnaireKeys.all, 'required'] as const,
  detail: (id: number) => [...questionnaireKeys.all, 'detail', id] as const,
  visible: (id: number) => [...questionnaireKeys.all, 'visible', id] as const,
  myAnswers: (id: number) =>
    [...questionnaireKeys.all, 'myAnswers', id] as const,
  completed: (id: number) =>
    [...questionnaireKeys.all, 'completed', id] as const,
};

// Get Registration Questionnaires (public)
export const useRegistrationQuestionnaires = (
  userType?: 'therapist' | 'client'
) => {
  return useQuery({
    queryKey: [...questionnaireKeys.registration(), userType],
    queryFn: () => getRegistrationQuestionnaires(userType),
  });
};

// Get Active Questionnaires
export const useActiveQuestionnaires = () => {
  return useQuery({
    queryKey: questionnaireKeys.active(),
    queryFn: getActiveQuestionnaires,
  });
};

// Get Required Questionnaires
export const useRequiredQuestionnaires = (enabled = true) => {
  return useQuery({
    queryKey: questionnaireKeys.required(),
    queryFn: getRequiredQuestionnaires,
    enabled,
  });
};

// Get Single Questionnaire
export const useQuestionnaire = (id: number) => {
  return useQuery({
    queryKey: questionnaireKeys.detail(id),
    queryFn: () => getQuestionnaire(id),
    enabled: !!id,
  });
};

// Get Visible Questions
export const useVisibleQuestions = (id: number) => {
  return useQuery({
    queryKey: questionnaireKeys.visible(id),
    queryFn: () => getVisibleQuestions(id),
    enabled: !!id,
  });
};

// Get My Answers
export const useMyAnswers = (id: number) => {
  return useQuery({
    queryKey: questionnaireKeys.myAnswers(id),
    queryFn: () => getMyAnswers(id),
    enabled: !!id,
  });
};

// Check Questionnaire Completed
export const useQuestionnaireCompleted = (id: number) => {
  return useQuery({
    queryKey: questionnaireKeys.completed(id),
    queryFn: () => checkQuestionnaireCompleted(id),
    enabled: !!id,
  });
};

// Submit Answers Mutation
export const useSubmitAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitQuestionnaireDto) =>
      submitQuestionnaireAnswers(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after submission
      queryClient.invalidateQueries({
        queryKey: questionnaireKeys.visible(variables.questionnaireId),
      });
      queryClient.invalidateQueries({
        queryKey: questionnaireKeys.myAnswers(variables.questionnaireId),
      });
      queryClient.invalidateQueries({
        queryKey: questionnaireKeys.completed(variables.questionnaireId),
      });
    },
  });
};
