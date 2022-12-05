import { LinkWithImage } from 'api/types';

export interface Footer {
	firstBlock: string;
	socials: LinkWithImage[];
	fourthBlock: string;
}

export interface Layout {
	footer: Footer;
}
