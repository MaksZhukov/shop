import { Popover } from '@mui/material';
import { FC } from 'react';
import { ModalContainer } from 'components/ui';
import { WorkingHour } from 'types';
import { WorkingHoursList } from './WorkingHoursList';

interface DesktopScheduleProps {
	anchorEl: HTMLElement | null;
	workingHours: WorkingHour[];
	onClose: () => void;
}

export const DesktopSchedule: FC<DesktopScheduleProps> = ({ anchorEl, workingHours, onClose }) => {
	const scheduleContent = (
		<ModalContainer onClose={onClose} title='График работы' width='344px'>
			<WorkingHoursList workingHours={workingHours} />
		</ModalContainer>
	);
	return (
		<Popover
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={onClose}
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
			{scheduleContent}
		</Popover>
	);
};
