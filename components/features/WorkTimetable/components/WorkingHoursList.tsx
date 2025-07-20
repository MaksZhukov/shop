import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { getCurrentSchedule } from 'services/DateService';
import { WorkingHour } from 'types';

interface WorkingHoursListProps {
	workingHours: WorkingHour[];
}

export const WorkingHoursList: FC<WorkingHoursListProps> = ({ workingHours }) => {
	const currentSchedule = getCurrentSchedule(workingHours);

	return (
		<>
			{workingHours.map((schedule) => {
				const isToday = currentSchedule?.dayIndex === schedule.dayIndex;
				const textColor = isToday ? 'info.main' : 'inherit';

				return (
					<Box key={schedule.day} py={1} display={'flex'} justifyContent={'space-between'}>
						<Typography variant='body1' fontSize={'16px'} color={textColor}>
							{schedule.day}
						</Typography>
						<Typography variant='body1' fontSize={'16px'} color={textColor}>
							{schedule.hours}
						</Typography>
					</Box>
				);
			})}
		</>
	);
};
