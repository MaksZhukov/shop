import { useMemo } from 'react';
import type { WorkingHour } from 'features/workTimetable/workTimetableTypes';
import { getCurrentTimeInGMT3 } from 'shared/utils/dateUtils';
import { useCurrentSchedule } from 'features/workTimetable/hooks/useCurrentSchedule';

export const useIsCurrentlyOpen = (workingHours: WorkingHour[]) => {
	const currentSchedule = useCurrentSchedule(workingHours);

	return useMemo(() => {
		if (!currentSchedule) return false;

		const gmt3Time = getCurrentTimeInGMT3();
		const currentTime = gmt3Time.getUTCHours() * 60 + gmt3Time.getUTCMinutes();

		const [openTime, closeTime] = currentSchedule.hours.split(' - ');
		const [openHour, openMinute] = openTime.split(':').map(Number);
		const [closeHour, closeMinute] = closeTime.split(':').map(Number);

		const openMinutes = openHour * 60 + openMinute;
		const closeMinutes = closeHour * 60 + closeMinute;

		return currentTime >= openMinutes && currentTime < closeMinutes;
	}, [currentSchedule]);
};
