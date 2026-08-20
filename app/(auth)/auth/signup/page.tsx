import type { Metadata } from 'next';
import SignUpMainWrapper from './_components/signup-main-wrapper';

export const metadata: Metadata = {
  title: 'Create account — DevPlayground',
  description: 'Create an account for the DevPlayground admin area.',
};

const SignUpPage = () => {
  return <SignUpMainWrapper />;
};

export default SignUpPage;
