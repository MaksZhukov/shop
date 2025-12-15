import { InstagramIcon, TelegramIcon, WhatsAppIcon, SkypeIcon, ViberIcon } from 'shared/icons';

export const SOCIAL_TELEGRAM = {
	Component: TelegramIcon,
	name: 'Telegram',
	href: 'https://t.me/autorazbornews'
};

export const SOCIAL_BUTTONS = [
	SOCIAL_TELEGRAM,
	{ Component: WhatsAppIcon, name: 'WhatsApp', href: 'https://wa.me/375297804780' },
	{ Component: ViberIcon, name: 'Viber', href: 'viber://chat?number=375297804780' },
	{ Component: SkypeIcon, name: 'Skype', href: 'skype:+375297804780?call' },
	{
		Component: InstagramIcon,
		name: 'Instagram',
		href: 'https://instagram.com/razbor_auto'
	}
] as const;
