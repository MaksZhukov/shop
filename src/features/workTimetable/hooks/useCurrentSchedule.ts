import { useMemo } from 'react';
import { WorkingHour } from '../workTimetableTypes';
import { getCurrentTimeInGMT3 } from 'shared/utils/dateUtils';

export const useCurrentSchedule = (workingHours: WorkingHour[]) => {
	return useMemo(() => {
		const gmt3Time = getCurrentTimeInGMT3();
		const currentDay = gmt3Time.getUTCDay();
		return workingHours.find((schedule) => schedule.dayIndex === currentDay);
	}, [workingHours]);
};
