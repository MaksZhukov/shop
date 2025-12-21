import { Box, Typography } from '@mui/material';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from 'shared/icons';
import { FC } from 'react';
import { useCurrentSchedule } from '../hooks/useCurrentSchedule';
import { useIsCurrentlyOpen } from '../hooks/useIsCurrentlyOpen';
import { getCurrentTimeInGMT3 } from 'shared/utils/dateUtils';
import { WORKING_HOURS } from '../workTimetableConstants';
import { CLOSED_MINUTES_BEFORE_CLOSE } from '../workTimetableConstants';

interface WorkTimetableTriggerProps {
	isMobile: boolean;
	isOpen: boolean;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const WorkTimetableTrigger: FC<WorkTimetableTriggerProps> = ({ isMobile, isOpen, onClick }) => {
	const currentSchedule = useCurrentSchedule(WORKING_HOURS);
	const isOpenNow = useIsCurrentlyOpen(WORKING_HOURS);

	const getStatus = () => {
		if (!currentSchedule) return { text: 'Закрыто до завтра', color: 'error.main' };

		const gmt3Time = getCurrentTimeInGMT3();
		const currentTime = gmt3Time.getUTCHours() * 60 + gmt3Time.getUTCMinutes();

		if (isOpenNow) {
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
