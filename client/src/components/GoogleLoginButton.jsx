import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface-raised p-1 shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
      <GoogleLogin
        theme="outline"
        size="large"
        text="signup_with"
        shape="pill"
        logo_alignment="left"
        width={280}
        containerProps={{
          className: 'overflow-hidden rounded-full',
        }}
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
    </div>
  );
}
