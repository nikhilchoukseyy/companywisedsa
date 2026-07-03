import { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  const containerRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(280);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth;
        // Google's min supported width is 200, cap max at 280
        setButtonWidth(Math.max(200, Math.min(280, availableWidth)));
      }
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="inline-flex w-full max-w-[280px] overflow-hidden rounded-full border border-border bg-surface-raised p-1 shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
    >
      <GoogleLogin
        theme="outline"
        size="large"
        text="signup_with"
        shape="pill"
        logo_alignment="left"
        width={buttonWidth}
        containerProps={{
          className: 'overflow-hidden rounded-full w-full',
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