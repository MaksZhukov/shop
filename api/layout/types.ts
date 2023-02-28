import { LinkWithImage } from 'api/types';

export interface Footer {
    firstBlock: string;
    socials: LinkWithImage[];
    fourthBlock: string;
    textAfterPayments: string;
}

export interface Layout {
    footer: Footer;
}
