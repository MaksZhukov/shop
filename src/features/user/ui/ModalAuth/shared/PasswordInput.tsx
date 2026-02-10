import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, OutlinedInput, OutlinedInputProps } from '@mui/material';
import { useState, useCallback } from 'react';

type PasswordInputProps = Omit<OutlinedInputProps, 'type'>;

export const PasswordInput = (props: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const toggleVisibility = useCallback(() => setShowPassword((prev) => !prev), []);

	return (
		<OutlinedInput
			{...props}
			type={showPassword ? 'text' : 'password'}
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						aria-label="toggle password visibility"
						onClick={toggleVisibility}
						edge="end"
					>
						{showPassword ? <VisibilityOff /> : <Visibility />}
					</IconButton>
				</InputAdornment>
			}
		/>
	);
};
