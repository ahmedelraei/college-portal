import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        studentId
        email
        firstName
        lastName
        role
      }
      message
    }
  }
`;

export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($adminLoginInput: AdminLoginInput!) {
    adminLogin(adminLoginInput: $adminLoginInput) {
      user {
        id
        email
        firstName
        lastName
        role
      }
      message
    }
  }
`;


export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      studentId
      email
      firstName
      lastName
      role
    }
  }
`;

export const IS_AUTHENTICATED_QUERY = gql`
  query IsAuthenticated {
    isAuthenticated
  }
`;

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent($createStudentInput: CreateStudentInput!) {
    createStudent(createStudentInput: $createStudentInput) {
      id
      studentId
      email
      firstName
      lastName
      role
    }
  }
`;

export const GET_ALL_STUDENTS_QUERY = gql`
  query GetAllStudents {
    getAllStudents {
      id
      studentId
      email
      firstName
      lastName
      role
      createdAt
    }
  }
`;

// TypeScript types
export interface User {
  id: number;
  studentId?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "ADMIN";
  createdAt?: string;
}

export interface LoginInput {
  studentId: number;
  password: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface CreateStudentInput {
  studentId: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

export interface LogoutResponse {
  message: string;
}
