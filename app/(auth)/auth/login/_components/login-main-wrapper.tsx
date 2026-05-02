import AuthLayoutWrapper from '@/components/common/auth-layout-wrapper';
import LoginForm from './login-form';

const LoginMainWrapper = () => {
  return <AuthLayoutWrapper formComponent={<LoginForm />} authType="login" />;
};

export default LoginMainWrapper;
