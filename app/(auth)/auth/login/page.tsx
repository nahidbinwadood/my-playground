import type { Metadata } from 'next';
import LoginMainWrapper from './_components/login-main-wrapper';

export const metadata: Metadata = {
  title: 'Sign in — DevPlayground',
  description: 'Sign in to the DevPlayground admin area.',
};

const LoginPage = () => {
  return <LoginMainWrapper />;
};

export default LoginPage;
