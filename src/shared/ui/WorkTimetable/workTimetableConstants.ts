import type { WorkingHour } from './workTimetableTypes';

export const WORKING_HOURS: WorkingHour[] = [
	{ day: 'Понедельник', hours: '10:00 - 18:00', dayIndex: 1 },
	{ day: 'Вторник', hours: '10:00 - 18:00', dayIndex: 2 },
	{ day: 'Среда', hours: '10:00 - 18:00', dayIndex: 3 },
	{ day: 'Четверг', hours: '10:00 - 18:00', dayIndex: 4 },
	{ day: 'Пятница', hours: '10:00 - 18:00', dayIndex: 5 },
	{ day: 'Суббота', hours: '10:00 - 14:00', dayIndex: 6 },
	{ day: 'Воскресенье', hours: '10:00 - 14:00', dayIndex: 0 }
];

export const CLOSED_MINUTES_BEFORE_CLOSE = 15;
