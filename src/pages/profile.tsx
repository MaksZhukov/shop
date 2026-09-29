import Head from 'next/head';
import { UserService, UserStore } from 'entities/user';
import { ProfileEntry, ProfileInjector, ProfileService } from 'features/profile';
import { createModuleInjector } from 'shared/di';
import { getPageProps } from 'shared/utils/pagePropsUtils';

export const inject = createModuleInjector([ProfileService, UserService, UserStore]);

const ProfilePage = () => {
	const profileService = inject(ProfileService);
	const userService = inject(UserService);
	const userStore = inject(UserStore);

	return (
		<>
			<Head>
				<title>Профиль</title>
				<meta name='description' content='Профиль пользователя'></meta>
			</Head>
			<ProfileInjector value={{ profileService, userService, userStore }}>
				<ProfileEntry />
			</ProfileInjector>
		</>
	);
};

export default ProfilePage;

export const getStaticProps = getPageProps();
