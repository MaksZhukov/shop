import { Box, Popover, Typography } from '@mui/material';
import { ChevronDownIcon, ClockIcon } from 'components/Icons';
import { FC, useState } from 'react';
import { ModalContent } from 'components/ui';
import { getCurrentSchedule, isCloseToClosing, isCurrentlyOpen } from 'services/DateService';
import { WORKING_HOURS } from '../../../constants';
import { WorkingHour } from 'types';

const CLOSED_MINUTES_BEFORE_CLOSE = 15;

export const WorkTimetable: FC = () => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const getTextColor = () =>
		isCloseToClosing(WORKING_HOURS, CLOSED_MINUTES_BEFORE_CLOSE) || !isCurrentlyOpen(WORKING_HOURS)
			? 'error.main'
			: 'text.secondary';

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const getStatusText = (workingHours: WorkingHour[], closedMinutesBeforeClose: number) => {
		const currentSchedule = getCurrentSchedule(workingHours);
		if (!currentSchedule) return 'Закрыто до завтра';

		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();

		if (isCurrentlyOpen(workingHours)) {
			const [_, closeTime] = currentSchedule.hours.split(' - ');
			const [closeHour, closeMinute] = closeTime.split(':').map(Number);
			const closeMinutes = closeHour * 60 + closeMinute;
			const minutesUntilClose = closeMinutes - currentTime;

			if (minutesUntilClose <= closedMinutesBeforeClose && minutesUntilClose > 0) {
				return `Закроется через ${minutesUntilClose} минут`;
			} else {
				return `Открыто до ${closeTime}`;
			}
		} else {
			return 'Закрыто до завтра';
		}
	};

	const popoverContent = (
		<ModalContent onClose={handleClose} title='График работы' width='344px'>
			{WORKING_HOURS.map((schedule) => (
				<Box key={schedule.day} py={1} display={'flex'} justifyContent={'space-between'}>
					<Typography variant='body1' fontSize={'16px'}>
						{schedule.day}
					</Typography>
					<Typography variant='body1' fontSize={'16px'}>
						{schedule.hours}
					</Typography>
				</Box>
			))}
		</ModalContent>
	);

	return (
		<Box>
			<Box
				color={getTextColor()}
				display={'flex'}
				alignItems={'center'}
				gap={1}
				onClick={handleClick}
				sx={{ cursor: 'pointer' }}
			>
				<ClockIcon />
				<Typography variant='body2'>{getStatusText(WORKING_HOURS, CLOSED_MINUTES_BEFORE_CLOSE)}</Typography>
				<ChevronDownIcon />
			</Box>

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				disableScrollLock
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				sx={{
					'& .MuiPopover-paper': {
						mt: 1
					}
				}}
			>
				{popoverContent}
			</Popover>
		</Box>
	);
};
