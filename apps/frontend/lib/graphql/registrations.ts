import { gql } from "@apollo/client";

// Registration Queries
export const GET_MY_REGISTRATIONS_QUERY = gql`
  query GetMyRegistrations {
    getMyRegistrations {
      id
      courseId
      semester
      year
      paymentStatus
      grade
      gradePoints
      isCompleted
      isDropped
      createdAt
      updatedAt
      course {
        id
        courseCode
        courseName
        description
        creditHours
        semester
        isActive
      }
    }
  }
`;

export const GET_MY_CURRENT_SEMESTER_REGISTRATIONS_QUERY = gql`
  query GetMyCurrentSemesterRegistrations($semester: String!, $year: Int!) {
    getMyCurrentSemesterRegistrations(semester: $semester, year: $year) {
      id
      courseId
      semester
      year
      paymentStatus
      grade
      isCompleted
      isDropped
      course {
        id
        courseCode
        courseName
        description
        creditHours
        semester
      }
    }
  }
`;

// Registration Mutations
export const REGISTER_FOR_COURSE_MUTATION = gql`
  mutation RegisterForCourse($registerInput: CreateRegistrationInput!) {
    registerForCourse(registerInput: $registerInput) {
      id
      courseId
      semester
      year
      paymentStatus
      createdAt
    }
  }
`;

export const BULK_REGISTER_FOR_COURSES_MUTATION = gql`
  mutation BulkRegisterForCourses($bulkRegisterInput: BulkRegistrationInput!) {
    bulkRegisterForCourses(bulkRegisterInput: $bulkRegisterInput) {
      id
      courseId
      semester
      year
      paymentStatus
      createdAt
      course {
        id
        courseCode
        courseName
        creditHours
      }
    }
  }
`;

export const DROP_COURSE_MUTATION = gql`
  mutation DropCourse($registrationId: Int!) {
    dropCourse(registrationId: $registrationId)
  }
`;

// TypeScript types
export interface Registration {
  id: number;
  courseId: number;
  semester: string;
  year: number;
  paymentStatus: string;
  grade?: string;
  gradePoints?: number;
  isCompleted: boolean;
  isDropped: boolean;
  createdAt: string;
  updatedAt: string;
  course: {
    id: number;
    courseCode: string;
    courseName: string;
    description: string;
    creditHours: number;
    semester: string;
    isActive: boolean;
  };
}

export interface CreateRegistrationInput {
  courseId: number;
  semester: string;
  year: number;
}

export interface BulkRegistrationInput {
  courseIds: number[];
  semester: string;
  year: number;
}
