import { ConditionalValidationForm } from '@/components/forms/conditional-validation-form';
import { IChallenge } from '../types';

export const challenges: IChallenge[] = [
  {
    id: 'conditional-validation',
    title: 'Conditional Field Validation',
    difficulty: 'Medium',
    description:
      'Build a form where certain fields become required based on the value of other fields. This tests your understanding of dynamic validation rules.',
    requirements: [
      'Create a form with 5 fields: Name, Email, Account Type (select), Company Name, and Phone',
      'If Account Type is "Business", Company Name becomes required',
      'If Account Type is "Personal", Phone becomes required',
      'Email must be valid format',
      'Show appropriate error messages for each field',
    ],
    component: ConditionalValidationForm,
    completed: true,
  },
  {
    id: 'dynamic-fields',
    title: 'Dynamic Form Fields',
    difficulty: 'Hard',
    description:
      'Create a form that allows users to add and remove field groups dynamically. Perfect for scenarios like adding multiple addresses or contacts.',
    requirements: [
      'Allow users to add/remove multiple address entries',
      'Each address should have: Street, City, State, Zip Code',
      'Validate all fields in each address group',
      'Minimum 1 address required, maximum 5 addresses',
      'Display validation errors for each address separately',
    ],
    completed: false,
  },
  {
    id: 'async-validation',
    title: 'Async Field Validation',
    difficulty: 'Hard',
    description:
      'Implement asynchronous validation to check if a username or email is already taken. This simulates real-world API validation scenarios.',
    requirements: [
      'Create a registration form with username and email',
      'Check username availability with async validation (simulate API call)',
      'Show loading state during validation',
      'Display appropriate messages for available/taken usernames',
      'Debounce the validation to avoid excessive checks',
    ],
    completed: false,
  },
  {
    id: 'password-strength',
    title: 'Password Strength Validation',
    difficulty: 'Medium',
    description:
      'Build a form with complex password requirements and a visual strength indicator. Tests pattern matching and custom validation logic.',
    requirements: [
      'Password must be at least 8 characters',
      'Must contain uppercase, lowercase, number, and special character',
      'Show real-time password strength indicator',
      'Confirm password field must match',
      'Display which requirements are met/not met',
    ],
    completed: false,
  },
  {
    id: 'multi-step-form',
    title: 'Multi-Step Form with Validation',
    difficulty: 'Hard',
    description:
      'Create a multi-step form where each step must be validated before proceeding. Maintain form state across steps.',
    requirements: [
      'Create 3 steps: Personal Info, Address, Review',
      'Each step has its own validation rules',
      'Cannot proceed to next step without valid data',
      'Allow going back to previous steps',
      'Show progress indicator',
      'Final review before submission',
    ],
    completed: false,
  },
];
