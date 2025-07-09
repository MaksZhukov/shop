import { TelegramShareButton, WhatsappShareButton, ViberShareButton } from 'react-share';
import { TelegramIcon, ViberIcon, WhatsAppIcon } from 'components/Icons';

export const SHARE_BUTTONS = [
	{ Component: TelegramShareButton, Icon: TelegramIcon, name: 'Telegram' },
	{ Component: WhatsappShareButton, Icon: WhatsAppIcon, name: 'WhatsApp' },
	{ Component: ViberShareButton, Icon: ViberIcon, name: 'Viber' }
] as const;
