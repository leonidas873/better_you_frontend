import httpClient from '../httpClient';

export interface RegisterClientDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  emergencyContact?: string;
  medicalHistory?: string;
  therapyGoals?: string;
  phone?: string;
}

export interface RegisterTherapistDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: 'therapist' | 'client';
  };
}

// Register as client
export const registerClient = async (
  data: RegisterClientDto
): Promise<AuthResponse> => {
  // First register the user
  await httpClient.post('/user/client/register', data);

  // Then login to get JWT token
  const loginResponse = await httpClient.post<AuthResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });

  return loginResponse.data;
};

// Register as therapist
export const registerTherapist = async (
  data: RegisterTherapistDto
): Promise<AuthResponse> => {
  // First register the user
  await httpClient.post('/user/therapist/register', data);

  // Then login to get JWT token
  const loginResponse = await httpClient.post<AuthResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });

  return loginResponse.data;
};

// Login
export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};
