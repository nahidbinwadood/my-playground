import AuthLayoutWrapper from '@/components/common/auth-layout-wrapper';
import SignupForm from './signup-form';

const SignUpMainWrapper = () => {
  return <AuthLayoutWrapper formComponent={<SignupForm />} authType="signup" />;
};

export default SignUpMainWrapper;
