import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={false}
        shape="rectangular"
        size="large"
        width="100%"
        text="signin_with"
        theme="outline"
      />
    </div>
  );
};

export default GoogleLoginButton;
