import { gql } from "@apollo/client";

// Admin Queries
export const GET_ALL_REGISTRATIONS_QUERY = gql`
  query GetAllRegistrations {
    getAllRegistrations {
      id
      courseId
      studentId
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
      }
      student {
        id
        studentId
        firstName
        lastName
        email
        currentGPA
      }
    }
  }
`;

// Admin Mutations
export const ASSIGN_GRADE_MUTATION = gql`
  mutation AssignGrade($registrationId: Int!, $grade: String!) {
    assignGrade(registrationId: $registrationId, grade: $grade) {
      id
      grade
      gradePoints
      isCompleted
      student {
        id
        currentGPA
      }
    }
  }
`;

// TypeScript types
export interface Registration {
  id: number;
  courseId: number;
  studentId: number;
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
  };
  student: {
    id: number;
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    currentGPA: number;
  };
}

export interface AssignGradeInput {
  registrationId: number;
  grade: string;
}
