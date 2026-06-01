import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FC, useCallback } from 'react';
import { WORKING_HOURS } from '../workTimetableConstants';
import { DesktopSchedule } from './DesktopSchedule';
import { MobileSchedule } from './MobileSchedule';
import { WorkTimetableTrigger } from './WorkTimetableTrigger';
import { useWorkTimetableState } from '../hooks/useWorkTimetableState';

interface WorkTimetableProps {
	compact?: boolean;
}

export const WorkTimetable: FC<WorkTimetableProps> = ({ compact = false }) => {
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
        <Box sx={{
            width: compact ? 'auto' : { xs: '100%', md: 'auto' }
        }}>
            <WorkTimetableTrigger
				compact={compact}
				isOpen={isOpen || Boolean(anchorEl)}
				isMobile={isMobile}
				onClick={handleClick}
			/>
            {isMobile ? (
				<MobileSchedule isOpen={isOpen} workingHours={WORKING_HOURS} onClose={handleClose} />
			) : (
				<DesktopSchedule anchorEl={anchorEl} workingHours={WORKING_HOURS} onClose={handleClose} />
			)}
        </Box>
    );
};
