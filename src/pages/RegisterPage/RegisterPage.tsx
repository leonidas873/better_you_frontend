import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useRegistrationQuestionnaires,
  useSubmitAnswers,
  type SubmitAnswerDto,
} from '../../services/questions';
import { registerClient } from '../../services/auth/auth.api';
import QuestionnaireForm from './QuestionnaireForm';

type RegistrationStep = 'questionnaire' | 'account' | 'complete';

interface QuestionnaireAnswers {
  questionnaireId: number;
  answers: SubmitAnswerDto[];
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>('questionnaire');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registration questionnaires (public endpoint)
  const { data: questionnaires, isLoading: loadingQuestionnaires } =
    useRegistrationQuestionnaires();
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);

  // Store questionnaire answers to submit after registration
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    QuestionnaireAnswers[]
  >([]);

  const submitAnswersMutation = useSubmitAnswers();

  const currentQuestionnaire =
    questionnaires && questionnaires[currentQuestionnaireIndex];

  // Clear any existing tokens when component mounts (fresh registration)
  useEffect(() => {
    localStorage.removeItem('auth_token');
  }, []);

  // If no questionnaires, skip to account creation
  useEffect(() => {
    if (
      step === 'questionnaire' &&
      questionnaires !== undefined &&
      questionnaires.length === 0
    ) {
      setStep('account');
    }
  }, [step, questionnaires]);

  const handleQuestionnaireComplete = (answers: SubmitAnswerDto[]) => {
    if (!currentQuestionnaire) return;

    // Store answers for this questionnaire
    setQuestionnaireAnswers(prev => [
      ...prev,
      {
        questionnaireId: currentQuestionnaire.id,
        answers,
      },
    ]);

    // Move to next questionnaire or to account creation
    if (
      questionnaires &&
      currentQuestionnaireIndex < questionnaires.length - 1
    ) {
      setCurrentQuestionnaireIndex(prev => prev + 1);
    } else {
      setStep('account');
    }
  };

  const handleSkipQuestionnaire = (answers: SubmitAnswerDto[]) => {
    // If answers provided, store them (even if skipping, user might have partially filled)
    if (currentQuestionnaire && answers.length > 0) {
      setQuestionnaireAnswers(prev => [
        ...prev,
        {
          questionnaireId: currentQuestionnaire.id,
          answers,
        },
      ]);
    }

    // Move to next questionnaire or to account creation
    if (
      questionnaires &&
      currentQuestionnaireIndex < questionnaires.length - 1
    ) {
      setCurrentQuestionnaireIndex(prev => prev + 1);
    } else {
      setStep('account');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      // Split fullName into firstName and lastName
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Register user (only account fields, NOT answers)
      const authResponse = await registerClient({
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
      });

      // Store the JWT token from registration/login response
      localStorage.setItem('auth_token', authResponse.access_token);

      // Now submit all questionnaire answers (requires authentication)
      for (const qa of questionnaireAnswers) {
        try {
          // Validate that all question IDs in answers belong to this questionnaire
          // Fetch the current questionnaire to verify question IDs
          const { getQuestionnaire } = await import(
            '../../services/questions/questions.api'
          );
          const currentQuestionnaire = await getQuestionnaire(
            qa.questionnaireId
          );

          // Get valid question IDs for this questionnaire
          const validQuestionIds = new Set(
            currentQuestionnaire.questions.map(q => q.id)
          );

          // Filter out any answers with invalid question IDs
          const validAnswers = qa.answers.filter(answer =>
            validQuestionIds.has(answer.questionId)
          );

          if (validAnswers.length === 0) {
            console.warn(
              `No valid answers for questionnaire ${qa.questionnaireId} - skipping`
            );
            continue;
          }

          // Submit only valid answers
          await submitAnswersMutation.mutateAsync({
            questionnaireId: qa.questionnaireId,
            answers: validAnswers,
          });
        } catch (error: unknown) {
          console.error('Failed to submit questionnaire answers:', error);
          // Continue with other questionnaires even if one fails
        }
      }

      setStep('complete');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalComplete = () => {
    navigate('/client-dashboard');
  };

  // Loading state
  if (loadingQuestionnaires) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Questionnaire Step
  if (
    step === 'questionnaire' &&
    questionnaires &&
    questionnaires.length > 0 &&
    currentQuestionnaire
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          {/* Progress indicator */}
          {questionnaires.length > 1 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentQuestionnaireIndex + 1} of{' '}
                  {questionnaires.length + 1}
                </span>
                <span className="text-sm text-gray-500">
                  Questionnaire {currentQuestionnaireIndex + 1} of{' '}
                  {questionnaires.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionnaireIndex + 1) / (questionnaires.length + 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <QuestionnaireForm
              questionnaire={currentQuestionnaire}
              onComplete={handleQuestionnaireComplete}
              onSkip={
                !currentQuestionnaire.isRequired
                  ? handleSkipQuestionnaire
                  : undefined
              }
              isRegistrationFlow={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Account Creation Form
  if (step === 'account') {
    const totalSteps = (questionnaires?.length || 0) + 1;
    const currentStep = (questionnaires?.length || 0) + 1;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Progress indicator */}
          {totalSteps > 1 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  Create Your Account
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleAccountSubmit}>
              <div>
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{' '}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Registration Complete (only show when step is 'complete')
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              Your account has been created successfully. Welcome to Better You!
            </p>
            <button
              onClick={handleFinalComplete}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: return null or loading state
  return null;
};

export default RegisterPage;
