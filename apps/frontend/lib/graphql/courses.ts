import { gql } from "@apollo/client";

// Course Queries
export const GET_ALL_COURSES_QUERY = gql`
  query GetAllCourses {
    getAllCourses {
      id
      courseCode
      courseName
      description
      creditHours
      semester
      prerequisites {
        id
        courseCode
        courseName
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSE_BY_ID_QUERY = gql`
  query GetCourseById($id: Int!) {
    getCourseById(id: $id) {
      id
      courseCode
      courseName
      description
      creditHours
      semester
      prerequisites {
        id
        courseCode
        courseName
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Course Mutations
export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($createCourseInput: CreateCourseInput!) {
    createCourse(createCourseInput: $createCourseInput) {
      id
      courseCode
      courseName
      description
      creditHours
      semester
      prerequisites {
        id
        courseCode
        courseName
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: Int!, $updateCourseInput: UpdateCourseInput!) {
    updateCourse(id: $id, updateCourseInput: $updateCourseInput) {
      id
      courseCode
      courseName
      description
      creditHours
      semester
      prerequisites {
        id
        courseCode
        courseName
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: Int!) {
    deleteCourse(id: $id) {
      message
    }
  }
`;

// TypeScript types
export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  creditHours: number;
  semester: string;
  prerequisites: Course[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  courseCode: string;
  courseName: string;
  description: string;
  creditHours: number;
  semester: string;
  prerequisiteIds?: number[];
}

export interface UpdateCourseInput {
  courseCode?: string;
  courseName?: string;
  description?: string;
  creditHours?: number;
  semester?: string;
  prerequisiteIds?: number[];
  isActive?: boolean;
}
