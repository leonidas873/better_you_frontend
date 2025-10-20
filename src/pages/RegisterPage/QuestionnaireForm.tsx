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

  const currentQuestion = questionnaire.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === questionnaire.questions.length - 1;
  const progress =
    ((currentQuestionIndex + 1) / questionnaire.questions.length) * 100;

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

  // Handle next/submit for current question
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

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
        <h2 className="text-2xl font-bold text-gray-900">
          {questionnaire.title}
        </h2>
        {questionnaire.description && (
          <p className="mt-2 text-gray-600">{questionnaire.description}</p>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of{' '}
              {questionnaire.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Show only current question */}
        <div data-has-error={errors.has(currentQuestion.id) ? 'true' : 'false'}>
          <QuestionRenderer
            question={currentQuestion}
            answer={answers.get(currentQuestion.id)}
            onChange={handleAnswerChange}
            error={errors.get(currentQuestion.id)}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-4">
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
                  className="text-sm text-gray-600 hover:text-gray-800"
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
