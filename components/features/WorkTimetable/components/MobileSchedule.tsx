import { Box } from '@mui/material';
import { FC } from 'react';
import { WorkingHour } from 'types';
import { WorkingHoursList } from './WorkingHoursList';

interface MobileScheduleProps {
	isOpen: boolean;
	workingHours: WorkingHour[];
	onClose: () => void;
}

export const MobileSchedule: FC<MobileScheduleProps> = ({ isOpen, workingHours, onClose }) => {
	if (!isOpen) return null;
	return (
		<Box bgcolor={'custom.bg-surface-1'} mt={1} p={2} borderRadius={4}>
			<WorkingHoursList workingHours={workingHours} />
		</Box>
	);
};
