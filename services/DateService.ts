import { WorkingHour } from '../types';

export const generateArrayOfYears = (count: number) => {
	const max = new Date().getFullYear();
	const min = max - count;
	const years = [];

	for (var i = max; i >= min; i--) {
		years.push(i);
	}
	return years;
};

export const getCurrentTimeInGMT3 = (): Date => {
	const now = new Date();
	const gmt3Time = new Date(now.getTime() + 3 * 60 * 60 * 1000);
	return gmt3Time;
};

export const getCurrentSchedule = (workingHours: WorkingHour[]) => {
	const gmt3Time = getCurrentTimeInGMT3();
	const currentDay = gmt3Time.getUTCDay();
	return workingHours.find((schedule) => schedule.dayIndex === currentDay);
};

export const isCurrentlyOpen = (workingHours: WorkingHour[]) => {
	const currentSchedule = getCurrentSchedule(workingHours);
	if (!currentSchedule) return false;

	const gmt3Time = getCurrentTimeInGMT3();
	const currentTime = gmt3Time.getUTCHours() * 60 + gmt3Time.getUTCMinutes();

	const [openTime, closeTime] = currentSchedule.hours.split(' - ');
	const [openHour, openMinute] = openTime.split(':').map(Number);
	const [closeHour, closeMinute] = closeTime.split(':').map(Number);

	const openMinutes = openHour * 60 + openMinute;
	const closeMinutes = closeHour * 60 + closeMinute;

	return currentTime >= openMinutes && currentTime < closeMinutes;
};

export const isCloseToClosing = (workingHours: WorkingHour[], closedMinutesBeforeClose: number) => {
	const currentSchedule = getCurrentSchedule(workingHours);
	if (!currentSchedule || !isCurrentlyOpen(workingHours)) return false;

	const gmt3Time = getCurrentTimeInGMT3();
	const currentTime = gmt3Time.getUTCHours() * 60 + gmt3Time.getUTCMinutes();

	const [_, closeTime] = currentSchedule.hours.split(' - ');
	const [closeHour, closeMinute] = closeTime.split(':').map(Number);
	const closeMinutes = closeHour * 60 + closeMinute;
	const minutesUntilClose = closeMinutes - currentTime;

	return minutesUntilClose <= closedMinutesBeforeClose && minutesUntilClose > 0;
};
