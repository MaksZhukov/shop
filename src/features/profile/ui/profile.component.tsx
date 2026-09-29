import { Container } from '@mui/material';
import { ProfileForm } from './profileForm.component';
import { ProfileHeader } from './profileHeader.component';

export const ProfileEntry = () => (
	<Container>
		<ProfileHeader />
		<ProfileForm />
	</Container>
);
