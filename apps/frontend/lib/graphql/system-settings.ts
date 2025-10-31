import { gql } from "@apollo/client";

export const IS_REGISTRATION_ENABLED_QUERY = gql`
  query IsRegistrationEnabled {
    isRegistrationEnabled
  }
`;

export const TOGGLE_REGISTRATION_MUTATION = gql`
  mutation ToggleRegistration($enabled: Boolean!) {
    toggleRegistration(enabled: $enabled) {
      id
      settingKey
      settingValue
      description
      updatedAt
    }
  }
`;

export const GET_ALL_SETTINGS_QUERY = gql`
  query GetAllSettings {
    getAllSettings {
      id
      settingKey
      settingValue
      description
      createdAt
      updatedAt
    }
  }
`;

