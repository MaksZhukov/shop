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

export const getCurrentSchedule = (workingHours: WorkingHour[]) => {
	const now = new Date();
	const currentDay = now.getDay();
	return workingHours.find((schedule) => schedule.dayIndex === currentDay);
};

export const isCurrentlyOpen = (workingHours: WorkingHour[]) => {
	const currentSchedule = getCurrentSchedule(workingHours);
	if (!currentSchedule) return false;

	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

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

	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

	const [_, closeTime] = currentSchedule.hours.split(' - ');
	const [closeHour, closeMinute] = closeTime.split(':').map(Number);
	const closeMinutes = closeHour * 60 + closeMinute;
	const minutesUntilClose = closeMinutes - currentTime;

	return minutesUntilClose <= closedMinutesBeforeClose && minutesUntilClose > 0;
};
