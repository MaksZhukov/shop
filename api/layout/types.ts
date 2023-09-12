import { Image, LinkWithImage } from 'api/types';

export interface Footer {
	firstBlock: string;
	socials: LinkWithImage[];
	fourthBlock: string;
	textAfterPayments: string;
	videoWidget: {
		video: Image;
		show: boolean;
	};
}

export interface Layout {
	footer: Footer;
}
