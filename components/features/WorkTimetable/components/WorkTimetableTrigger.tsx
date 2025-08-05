import { Box, Typography } from '@mui/material';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from 'components/icons';
import { FC } from 'react';
import { getCurrentSchedule, isCurrentlyOpen } from 'services/DateService';
import { WORKING_HOURS } from '../../../../constants';
import { CLOSED_MINUTES_BEFORE_CLOSE } from '../constants';

interface WorkTimetableTriggerProps {
	isMobile: boolean;
	isOpen: boolean;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const WorkTimetableTrigger: FC<WorkTimetableTriggerProps> = ({ isMobile, isOpen, onClick }) => {
	const getStatus = () => {
		const currentSchedule = getCurrentSchedule(WORKING_HOURS);
		if (!currentSchedule) return { text: 'Закрыто до завтра', color: 'error.main' };

		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();

		if (isCurrentlyOpen(WORKING_HOURS)) {
			const [_, closeTime] = currentSchedule.hours.split(' - ');
			const [closeHour, closeMinute] = closeTime.split(':').map(Number);
			const closeMinutes = closeHour * 60 + closeMinute;
			const minutesUntilClose = closeMinutes - currentTime;

			if (minutesUntilClose <= CLOSED_MINUTES_BEFORE_CLOSE && minutesUntilClose > 0) {
				return {
					text: `Закроется через ${minutesUntilClose} минут`,
					color: 'error.main'
				};
			} else {
				return {
					text: `Открыто до ${closeTime}`,
					color: 'text.secondary'
				};
			}
		} else {
			return { text: 'Закрыто до завтра', color: 'error.main' };
		}
	};

	const { text: statusText, color: textColor } = getStatus();

	const mobileStyles = isMobile
		? {
				bgcolor: 'custom.bg-surface-1',
				cursor: 'pointer',
				p: 1,
				justifyContent: 'center',
				borderRadius: 4
		  }
		: { cursor: 'pointer' };

	return (
		<Box color={textColor} display={'flex'} alignItems={'center'} gap={1} sx={mobileStyles} onClick={onClick}>
			<ClockIcon />
			<Typography variant='body2'>{statusText}</Typography>
			{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
		</Box>
	);
};
