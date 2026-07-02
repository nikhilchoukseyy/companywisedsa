import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <GoogleLogin
      text="signup_with"
      shape="pill"
      onSuccess={async (credentialResponse) => {
        try {
          await onSuccess?.(credentialResponse.credential);
        } catch (error) {
          onError?.(error);
        }
      }}
      onError={() => {
        onError?.(new Error('Google sign-in failed'));
      }}
    />
  );
}
