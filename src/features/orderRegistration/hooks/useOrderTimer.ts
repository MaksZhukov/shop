import { useEffect, useState } from 'react';
import type { Order } from 'entities/order';

export const useOrderTimer = (order: Order | undefined) => {
	const [remainingTime, setRemainingTime] = useState<number | null>(null);

	useEffect(() => {
		if (!order || !order.createdAt) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setRemainingTime(null);
			return;
		}

		const calculateRemainingTime = () => {
			const createdAt =
				typeof order.createdAt === 'string' ? new Date(order.createdAt).getTime() : order.createdAt;
			const expirationTime = createdAt + 20 * 60 * 1000;
			const now = Date.now();
			const remaining = Math.max(0, expirationTime - now);
			setRemainingTime(remaining);
		};

		calculateRemainingTime();
		const interval = setInterval(calculateRemainingTime, 1000);

		return () => clearInterval(interval);
	}, [order]);

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	return {
		remainingTime,
		formattedTime: remainingTime !== null ? formatTime(remainingTime) : null,
		isExpired: remainingTime !== null && remainingTime === 0
	};
};
