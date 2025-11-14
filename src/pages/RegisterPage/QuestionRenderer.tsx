import React from 'react';
import {
  type Question,
  QuestionType,
  type SubmitAnswerDto,
} from '../../services/questions';

interface QuestionRendererProps {
  question: Question;
  answer?: SubmitAnswerDto;
  onChange: (answer: SubmitAnswerDto) => void;
  error?: string;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onChange,
  error,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      questionId: question.id,
      textAnswer: e.target.value,
    });
  };

  const handleSingleChoice = (optionId: number) => {
    onChange({
      questionId: question.id,
      selectedOptionIds: [optionId],
    });
  };

  const handleMultipleChoice = (optionId: number, checked: boolean) => {
    const currentSelected = answer?.selectedOptionIds || [];
    const newSelected = checked
      ? [...currentSelected, optionId]
      : currentSelected.filter(id => id !== optionId);

    onChange({
      questionId: question.id,
      selectedOptionIds: newSelected,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const optionId = parseInt(e.target.value);
    if (optionId) {
      onChange({
        questionId: question.id,
        selectedOptionIds: [optionId],
      });
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case QuestionType.OPEN_TEXT:
        return (
          <div>
            <textarea
              value={answer?.textAnswer || ''}
              onChange={handleTextChange}
              rows={4}
              required={question.isRequired}
              className="appearance-none block w-full px-3 py-2 border border-tertiary-300 rounded-md placeholder-tertiary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              placeholder="Enter your answer..."
            />
          </div>
        );

      case QuestionType.SINGLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-3 border border-tertiary-300 rounded-md hover:bg-tertiary-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answer?.selectedOptionIds?.includes(option.id)}
                  onChange={() => handleSingleChoice(option.id)}
                  required={question.isRequired}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-tertiary-300"
                />
                <span className="text-sm text-tertiary-800">
                  {option.optionText}
                </span>
              </label>
            ))}
          </div>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-3 border border-tertiary-300 rounded-md hover:bg-tertiary-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={answer?.selectedOptionIds?.includes(option.id)}
                  onChange={e =>
                    handleMultipleChoice(option.id, e.target.checked)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-tertiary-300 rounded"
                />
                <span className="text-sm text-tertiary-800">
                  {option.optionText}
                </span>
              </label>
            ))}
          </div>
        );

      case QuestionType.SELECT:
        return (
          <select
            value={answer?.selectedOptionIds?.[0] || ''}
            onChange={handleSelectChange}
            required={question.isRequired}
            className="appearance-none block w-full px-3 py-2 border border-tertiary-300 rounded-md placeholder-tertiary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors bg-white"
          >
            <option value="">-- Select an option --</option>
            {question.options?.map(option => (
              <option key={option.id} value={option.id}>
                {option.optionText}
              </option>
            ))}
          </select>
        );

      default:
        return <p className="text-error">Unknown question type</p>;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-tertiary-800 mb-2">
        {question.questionText}
        {question.isRequired && <span className="text-error ml-1">*</span>}
      </label>

      {question.helpText && (
        <p className="text-sm text-tertiary-600 mb-3">{question.helpText}</p>
      )}

      {renderQuestion()}

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
};

export default QuestionRenderer;
