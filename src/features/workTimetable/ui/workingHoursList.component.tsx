import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useCurrentSchedule } from '../hooks/useCurrentSchedule';
import type { WorkingHour } from '../workTimetableTypes';

interface WorkingHoursListProps {
	workingHours: WorkingHour[];
}

export const WorkingHoursList: FC<WorkingHoursListProps> = ({ workingHours }) => {
	const currentSchedule = useCurrentSchedule(workingHours);

	return (
        <>
            {workingHours.map((schedule) => {
				const isToday = currentSchedule?.dayIndex === schedule.dayIndex;
				const textColor = isToday ? 'info.main' : 'inherit';

				return (
                    <Box
                        key={schedule.day}
                        sx={{
                            py: 1,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <Typography variant='body1' color={textColor} sx={{
                            fontSize: '16px'
                        }}>
							{schedule.day}
						</Typography>
                        <Typography variant='body1' color={textColor} sx={{
                            fontSize: '16px'
                        }}>
							{schedule.hours}
						</Typography>
                    </Box>
                );
			})}
        </>
    );
};
