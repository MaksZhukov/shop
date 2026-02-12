import { Box, Typography, Input, FormControl, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';
import { WhiteBox } from 'shared/ui';
import { AttachFileIcon, CloseIcon } from 'shared/icons';
import type { OrderRegistrationFormData, UserType } from '../types';

interface ContactInfoFormProps {
	formData: OrderRegistrationFormData;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onUserTypeChange: (userType: UserType) => void;
	onFieldChange: <K extends keyof OrderRegistrationFormData>(field: K, value: OrderRegistrationFormData[K]) => void;
	onUploadClick: () => void;
	onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
}

export const ContactInfoForm = ({
	formData,
	fileInputRef,
	onUserTypeChange,
	onFieldChange,
	onUploadClick,
	onFileChange,
	disabled = false
}: ContactInfoFormProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (formData.uploadedFile) {
			let url: string = URL.createObjectURL(formData.uploadedFile);

			// eslint-disable-next-line react-hooks/set-state-in-effect
			setPreviewUrl(url);

			return () => {
				if (url) {
					URL.revokeObjectURL(url);
				}
			};
		}
	}, [formData.uploadedFile]);

	const handleRemoveFile = () => {
		onFieldChange('uploadedFile', null);
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<WhiteBox p={2}>
			<FormControl component='fieldset' sx={{ mb: 1, width: '100%' }} disabled={disabled}>
				<RadioGroup
					row
					value={formData.userType}
					onChange={(e) => onUserTypeChange(e.target.value as UserType)}
				>
					<FormControlLabel
						value='individual'
						control={<Radio />}
						label='Физическое лицо'
						disabled={disabled}
					/>
					<FormControlLabel value='legal' control={<Radio />} label='Юридическое лицо' disabled={disabled} />
				</RadioGroup>
			</FormControl>

			<Typography variant='h6' component='h2' mb={2}>
				Контактные данные покупателя
			</Typography>
			<Box display='flex' flexDirection='column' gap={2} maxWidth='480px'>
				{formData.userType === 'individual' ? (
					<>
						<Input
							fullWidth
							placeholder='Имя *'
							value={formData.username}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('username', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
							disabled={disabled}
						/>
						<Input
							fullWidth
							placeholder='Телефон *'
							value={formData.phone}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('phone', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							inputProps={{
								mask: '+375 00 000 00 00',
								unmask: true
							}}
							required
							disabled={disabled}
						/>
						<Input
							fullWidth
							placeholder='Электронная почта *'
							type='email'
							value={formData.email}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('email', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
							disabled={disabled}
						/>
					</>
				) : (
					<>
						<Input
							fullWidth
							placeholder='Название *'
							value={formData.companyName}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								onFieldChange('companyName', e.target.value)
							}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
							disabled={disabled}
						/>
						<Input
							fullWidth
							placeholder='УНП *'
							value={formData.tin}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('tin', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
							disabled={disabled}
						/>
						<Input
							fullWidth
							placeholder='Телефон *'
							value={formData.phone}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('phone', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							inputProps={{
								mask: '+375 00 000 00 00',
								unmask: true
							}}
							required
							disabled={disabled}
						/>
						<Input
							fullWidth
							placeholder='Электронная почта *'
							type='email'
							value={formData.email}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('email', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
							disabled={disabled}
						/>
						<Box>
							<input
								type='file'
								ref={fileInputRef}
								onChange={onFileChange}
								accept='.jpeg,.jpg,.png,.pdf'
								style={{ display: 'none' }}
								required
								disabled={disabled}
							/>
							<Box
								onClick={disabled ? undefined : onUploadClick}
								maxWidth='480px'
								border='2px dashed  '
								borderColor={'custom.divider'}
								borderRadius={1}
								padding={1}
								bgcolor='custom.bg-surface-1'
								display='flex'
								alignItems='center'
								justifyContent='center'
								gap={1}
								sx={{
									cursor: disabled ? 'not-allowed' : 'pointer',
									opacity: disabled ? 0.6 : 1,
									'&:hover': {
										borderColor: disabled ? 'custom.divider' : 'primary.main',
										bgcolor: disabled ? 'custom.bg-surface-1' : 'action.hover'
									}
								}}
							>
								<AttachFileIcon />
								<Box>
									<Typography variant='body2' fontWeight={600} fontSize={16} color='text.primary'>
										{formData.uploadedFile
											? formData.uploadedFile.name
											: 'Нажмите, чтобы загрузить *'}
									</Typography>
									<Typography variant='caption' color='custom.text-muted'>
										Формат файла jpeg, png, pdf
									</Typography>
								</Box>
							</Box>
							{previewUrl && (
								<Box
									width={80}
									height={80}
									mt={0.5}
									border='2px solid'
									borderColor='custom.bg-surface-3'
									borderRadius={1}
									display='flex'
									alignItems='center'
									justifyContent='center'
									bgcolor='background.paper'
									overflow='hidden'
									position={'relative'}
								>
									{previewUrl ? (
										<Box
											component='img'
											src={previewUrl}
											alt='Preview'
											width={'100%'}
											height={'100%'}
											style={{ objectFit: 'cover' }}
										/>
									) : (
										<AttachFileIcon />
									)}
									<IconButton
										size='small'
										sx={{
											position: 'absolute',
											width: 20,
											height: 20,
											top: 0,
											right: 0,
											bgcolor: 'custom.text-muted',
											'&:hover': {
												bgcolor: 'custom.bg-surface-3'
											}
										}}
										onClick={handleRemoveFile}
										disabled={disabled}
									>
										<CloseIcon />
									</IconButton>
								</Box>
							)}
							<Typography variant='caption' color='custom.text-muted' mt={1} display='block'>
								Подойдет свидетельство о регистрации либо другой подтверждающий документ
							</Typography>
						</Box>
					</>
				)}
			</Box>
		</WhiteBox>
	);
};
