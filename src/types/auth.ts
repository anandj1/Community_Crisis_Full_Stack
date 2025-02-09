export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials extends LoginCredentials {
    name: string;
  }
  
  export interface OtpVerification {
    email: string;
    otp: string;
  }
  
  export interface PasswordReset {
    token: string;
    password: string;
  }