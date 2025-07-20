import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FC, useCallback } from 'react';
import { WORKING_HOURS } from '../../../constants';
import { DesktopSchedule } from './components/DesktopSchedule';
import { MobileSchedule } from './components/MobileSchedule';
import { WorkTimetableTrigger } from './components/WorkTimetableTrigger';
import { useWorkTimetableState } from './hooks/useWorkTimetableState';

export const WorkTimetable: FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const { anchorEl, isOpen, setAnchorEl, setIsOpen, handleClose } = useWorkTimetableState();

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (isMobile) {
				setIsOpen(!isOpen);
			} else {
				setAnchorEl(anchorEl ? null : event.currentTarget);
			}
		},
		[isMobile, isOpen, anchorEl, setIsOpen, setAnchorEl]
	);

	return (
		<Box width={{ xs: '100%', md: 'auto' }}>
			<WorkTimetableTrigger isOpen={isOpen || Boolean(anchorEl)} isMobile={isMobile} onClick={handleClick} />

			{isMobile ? (
				<MobileSchedule isOpen={isOpen} workingHours={WORKING_HOURS} onClose={handleClose} />
			) : (
				<DesktopSchedule anchorEl={anchorEl} workingHours={WORKING_HOURS} onClose={handleClose} />
			)}
		</Box>
	);
};
