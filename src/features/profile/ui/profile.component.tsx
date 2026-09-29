import { WhiteBox } from 'shared/ui';
import { ProfileForm } from './profileForm.component';
import { ProfileHeader } from './profileHeader.component';

export const ProfileEntry = () => (
	<WhiteBox sx={{ width: '100%', maxWidth: 600, mx: 'auto', mb: 4, p: { xs: 2, md: 4 } }}>
		<ProfileHeader />
		<ProfileForm />
	</WhiteBox>
);
