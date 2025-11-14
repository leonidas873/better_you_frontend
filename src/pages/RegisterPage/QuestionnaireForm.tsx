import React, { useState } from 'react';
import {
  type Questionnaire,
  type SubmitAnswerDto,
} from '../../services/questions';
import QuestionRenderer from './QuestionRenderer';

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
  onComplete: (answers: SubmitAnswerDto[]) => void;
  onSkip?: (answers: SubmitAnswerDto[]) => void;
  isRegistrationFlow?: boolean;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaire,
  onComplete,
  onSkip,
  isRegistrationFlow = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, SubmitAnswerDto>>(
    new Map()
  );
  const [errors, setErrors] = useState<Map<number, string>>(new Map());

  // Filter questions based on showIf conditions
  const getVisibleQuestions = () => {
    return questionnaire.questions.filter(question => {
      // If no condition, always show
      if (!question.showIf || !question.showIf.conditions) {
        return true;
      }

      // Evaluate conditions
      const logic = question.showIf.logic || 'AND';
      const results = question.showIf.conditions.map(condition => {
        // Find the answer for the referenced question
        const referencedAnswer = answers.get(condition.questionId);

        switch (condition.operator) {
          case 'answered':
            return !!referencedAnswer;

          case 'not_answered':
            return !referencedAnswer;

          case 'equals':
            if (!referencedAnswer) return false;
            if (
              condition.selectedOptionIds &&
              referencedAnswer.selectedOptionIds
            ) {
              const sortedAnswer = [
                ...referencedAnswer.selectedOptionIds,
              ].sort();
              const sortedCondition = [...condition.selectedOptionIds].sort();
              return (
                JSON.stringify(sortedAnswer) === JSON.stringify(sortedCondition)
              );
            }
            if (condition.textValue && referencedAnswer.textAnswer) {
              return referencedAnswer.textAnswer === condition.textValue;
            }
            return false;

          case 'not_equals':
            if (!referencedAnswer) return true;
            if (
              condition.selectedOptionIds &&
              referencedAnswer.selectedOptionIds
            ) {
              const sortedAnswer = [
                ...referencedAnswer.selectedOptionIds,
              ].sort();
              const sortedCondition = [...condition.selectedOptionIds].sort();
              return (
                JSON.stringify(sortedAnswer) !== JSON.stringify(sortedCondition)
              );
            }
            if (condition.textValue && referencedAnswer.textAnswer) {
              return referencedAnswer.textAnswer !== condition.textValue;
            }
            return true;

          case 'contains':
            if (!referencedAnswer || !condition.selectedOptionIds) return false;
            if (referencedAnswer.selectedOptionIds) {
              return condition.selectedOptionIds.some(optionId =>
                referencedAnswer.selectedOptionIds?.includes(optionId)
              );
            }
            if (condition.textValue && referencedAnswer.textAnswer) {
              return referencedAnswer.textAnswer.includes(condition.textValue);
            }
            return false;

          case 'not_contains':
            if (!referencedAnswer) return true;
            if (
              condition.selectedOptionIds &&
              referencedAnswer.selectedOptionIds
            ) {
              return !condition.selectedOptionIds.some(optionId =>
                referencedAnswer.selectedOptionIds?.includes(optionId)
              );
            }
            if (condition.textValue && referencedAnswer.textAnswer) {
              return !referencedAnswer.textAnswer.includes(condition.textValue);
            }
            return true;

          default:
            return false;
        }
      });

      // Apply logic (AND or OR)
      if (logic === 'AND') {
        return results.every(r => r === true);
      } else {
        return results.some(r => r === true);
      }
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;
  const progress =
    visibleQuestions.length > 0
      ? ((currentQuestionIndex + 1) / visibleQuestions.length) * 100
      : 100;

  // Handle answer change
  const handleAnswerChange = (answer: SubmitAnswerDto) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(answer.questionId, answer);
      return newAnswers;
    });

    // Clear error for this question
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(answer.questionId);
      return newErrors;
    });
  };

  // Reset index if current question is no longer visible
  React.useEffect(() => {
    if (
      currentQuestionIndex >= visibleQuestions.length &&
      visibleQuestions.length > 0
    ) {
      setCurrentQuestionIndex(visibleQuestions.length - 1);
    } else if (visibleQuestions.length === 0) {
      // No visible questions - might happen if all are conditional
      setCurrentQuestionIndex(0);
    }
  }, [visibleQuestions.length, currentQuestionIndex]);

  // Handle next/submit for current question
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentQuestion) return;

    // Validate current question if it's required
    if (currentQuestion.isRequired) {
      const answer = answers.get(currentQuestion.id);
      if (!answer) {
        setErrors(prev => {
          const newErrors = new Map(prev);
          newErrors.set(currentQuestion.id, 'This question is required');
          return newErrors;
        });
        return;
      } else if (
        answer.textAnswer === undefined &&
        (!answer.selectedOptionIds || answer.selectedOptionIds.length === 0)
      ) {
        setErrors(prev => {
          const newErrors = new Map(prev);
          newErrors.set(currentQuestion.id, 'This question is required');
          return newErrors;
        });
        return;
      }
    }

    // Clear error for current question
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(currentQuestion.id);
      return newErrors;
    });

    // If last question, submit all answers
    if (isLastQuestion) {
      onComplete(Array.from(answers.values()));
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Handle previous button
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-tertiary-900">
          {questionnaire.title}
        </h2>
        {questionnaire.description && (
          <p className="mt-2 text-tertiary-700">{questionnaire.description}</p>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-tertiary-800">
              Question {currentQuestionIndex + 1} of {visibleQuestions.length}
            </span>
            <span className="text-sm text-tertiary-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-tertiary-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Show only current question */}
        {currentQuestion ? (
          <div
            data-has-error={errors.has(currentQuestion.id) ? 'true' : 'false'}
          >
            <QuestionRenderer
              question={currentQuestion}
              answer={answers.get(currentQuestion.id)}
              onChange={handleAnswerChange}
              error={errors.get(currentQuestion.id)}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-tertiary-600">
            No questions available
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-tertiary-300">
          <div className="flex space-x-4">
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex justify-center py-2 px-6 border border-tertiary-300 rounded-md shadow-sm text-sm font-medium text-tertiary-800 bg-white hover:bg-tertiary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Previous
              </button>
            )}

            {onSkip &&
              !questionnaire.isRequired &&
              currentQuestionIndex === 0 && (
                <button
                  type="button"
                  onClick={() => onSkip(Array.from(answers.values()))}
                  className="text-sm text-tertiary-700 hover:text-tertiary-900 transition-colors"
                >
                  Skip questionnaire
                </button>
              )}
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLastQuestion
              ? isRegistrationFlow
                ? 'Continue'
                : 'Submit'
              : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
