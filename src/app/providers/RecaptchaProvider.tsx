'use client';
import { FC, ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'; // Optional lib for hooks

export const RecaptchaProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
			{children}
		</GoogleReCaptchaProvider>
	);
};
