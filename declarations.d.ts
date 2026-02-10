import axios, { AxiosError } from 'axios';

declare module 'axios' {
	interface Error {
		error: { status: number; message: string; name: string };
	}
	export interface AxiosStatic {
		isAxiosError(payload: any): payload is AxiosError<Error>;
	}
	export default axios;
}

declare global {
	class BeGateway {
		constructor(params: any);
		createWidget();
	}
}

declare module 'react-google-recaptcha' {
	import { Component } from 'react';
	export interface ReCAPTCHAProps {
		sitekey: string;
		theme?: 'light' | 'dark';
		size?: 'compact' | 'normal' | 'invisible';
	}
	export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
		getValue(): string | null;
		reset(): void;
		executeAsync(): Promise<string>;
	}
}

declare module '@mui/material/styles' {
	interface Palette {
		custom: {
			black: string;
			'dark-gray': string;
			'light-gray': string;
			'medium-gray': string;
			'text-inverse': string;
			'text-muted': string;
			divider: string;
			'bg-surface-4': string;
			shadow: string;
		};
	}
	interface PaletteOptions {
		custom?: {
			black?: string;
			'dark-gray'?: string;
			'light-gray'?: string;
			'medium-gray'?: string;
			'text-inverse'?: string;
			'text-muted'?: string;
			divider?: string;
			'bg-surface-4'?: string;
			'muted-foreground'?: string;
			'bg-surface-1'?: string;
			'bg-surface-3'?: string;
			shadow?: string;
		};
	}
}
