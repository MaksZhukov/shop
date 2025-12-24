import { Box, Typography, Input, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ChangeEvent } from 'react';
import { WhiteBox } from 'shared/ui';
import { AttachFileIcon } from 'shared/icons';
import type { OrderRegistrationFormData, UserType } from '../types';

interface ContactInfoFormProps {
	formData: OrderRegistrationFormData;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onUserTypeChange: (userType: UserType) => void;
	onFieldChange: <K extends keyof OrderRegistrationFormData>(field: K, value: OrderRegistrationFormData[K]) => void;
	onUploadClick: () => void;
	onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ContactInfoForm = ({
	formData,
	fileInputRef,
	onUserTypeChange,
	onFieldChange,
	onUploadClick,
	onFileChange
}: ContactInfoFormProps) => {
	return (
		<WhiteBox p={2}>
			<FormControl component='fieldset' sx={{ mb: 1, width: '100%' }}>
				<RadioGroup
					row
					value={formData.userType}
					onChange={(e) => onUserTypeChange(e.target.value as UserType)}
				>
					<FormControlLabel value='individual' control={<Radio />} label='Физическое лицо' />
					<FormControlLabel value='legal' control={<Radio />} label='Юридическое лицо' />
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
							value={formData.name}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('name', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
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
						/>
					</>
				) : (
					<>
						<Input
							fullWidth
							placeholder='Название *'
							value={formData.name}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('name', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
						/>
						<Input
							fullWidth
							placeholder='УНП *'
							value={formData.unp}
							size='medium'
							onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldChange('unp', e.target.value)}
							sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							required
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
						/>
						<Box>
							<input
								type='file'
								ref={fileInputRef}
								onChange={onFileChange}
								accept='.jpeg,.jpg,.png,.pdf'
								style={{ display: 'none' }}
								required
							/>
							<Box
								onClick={onUploadClick}
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
									cursor: 'pointer',
									'&:hover': {
										borderColor: 'primary.main',
										bgcolor: 'action.hover'
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
