import { useMemo } from 'react';
import type { WorkingHour } from '../workTimetableTypes';
import { getCurrentTimeInGMT3 } from 'shared/utils/dateUtils';
import { useCurrentSchedule } from './useCurrentSchedule';
import { useIsCurrentlyOpen } from './useIsCurrentlyOpen';

export const useIsCloseToClosing = (workingHours: WorkingHour[], closedMinutesBeforeClose: number) => {
	const currentSchedule = useCurrentSchedule(workingHours);
	const isOpen = useIsCurrentlyOpen(workingHours);

	return useMemo(() => {
		if (!currentSchedule || !isOpen) return false;

		const gmt3Time = getCurrentTimeInGMT3();
		const currentTime = gmt3Time.getUTCHours() * 60 + gmt3Time.getUTCMinutes();

		const [_, closeTime] = currentSchedule.hours.split(' - ');
		const [closeHour, closeMinute] = closeTime.split(':').map(Number);
		const closeMinutes = closeHour * 60 + closeMinute;
		const minutesUntilClose = closeMinutes - currentTime;

		return minutesUntilClose <= closedMinutesBeforeClose && minutesUntilClose > 0;
	}, [currentSchedule, isOpen, closedMinutesBeforeClose]);
};
