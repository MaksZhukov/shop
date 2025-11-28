import { useState, useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

export type DeviceType = 'desktop' | 'mobile';

export const useDeviceType = (): DeviceType => {
	const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

	useEffect(() => {
		const parser = new UAParser();
		const device = parser.getDevice();
		const deviceTypeResult = device.type === 'mobile' || device.type === 'tablet' ? 'mobile' : 'desktop';
		setDeviceType(deviceTypeResult);
	}, []);

	return deviceType;
};
