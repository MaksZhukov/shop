import { Button, Input, Link, ListItemButton, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { emailApi } from 'entities/email';
import { pageApi, PageContacts } from 'entities/page';
import { BlockImages } from 'shared/ui';
import { Image } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
import { Typography } from 'shared/ui';
import { useSnackbar } from 'notistack';
import { ChangeEventHandler, FormEvent, useState } from 'react';
import { useThrottle } from 'rooks';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: PageContacts;
}

const Contacts = ({ page }: Props) => {
	const [name, setName] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	const { enqueueSnackbar } = useSnackbar();

	const handleChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.name);
	};
	const handleChangePhone: ChangeEventHandler<HTMLInputElement> = (e) => {
		setPhone(e.target.value);
	};
	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = (e) => {
		setMessage(e.target.value);
	};
	const [throttledSubmit] = useThrottle(async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await emailApi.send(
				'Вопрос',
				`<b>Телефон</b>: ${phone} <br /><b>Имя</b>: ${name} <br /><b>Сообщение</b>: ${message} <br />`
			);
			enqueueSnackbar('Ваш вопрос успешно отправлен', {
				variant: 'success'
			});
			setName('');
			setPhone('');
			setMessage('');
			setPhone('');
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка при отправке, обратитесь в поддержку', {
				variant: 'error'
			});
		}
	}, 300);
	return (
        <>
			<Typography component='h1' variant='h4' sx={{ mb: '1.5em', textTransform: 'uppercase' }}>
				{page.h1}
			</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: '1em',
                    marginBottom: '2em',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
				<Box
                    sx={{
                        flex: '1',
                        display: 'flex',
                        padding: '2em 1em',
                        alignItems: 'center',
                        bgcolor: '#fff'
                    }}>
					<Image
						title={'Телефон 1'}
						src='/phone.png'
						width={50}
						isOnSSR={false}
						height={50}
						alt='Телефон 1'
					></Image>
					<Link
                        underline='hover'
                        href={`tel:${page.phone1.replaceAll(' ', '')}`}
                        sx={{
                            marginLeft: '1em',
                            color: '#000'
                        }}>
						{page.phone1}
					</Link>
				</Box>
				<Box
                    sx={{
                        flex: '1',
                        display: 'flex',
                        padding: '2em 1em',
                        bgcolor: '#fff',
                        alignItems: 'center'
                    }}>
					<Image
						title='Телефон 2'
						width={50}
						height={50}
						isOnSSR={false}
						src='/phone.png'
						alt='Телефон 2'
					></Image>
					<Link
                        underline='hover'
                        href={`tel:${page.phone2.replaceAll(' ', '')}`}
                        sx={{
                            marginLeft: '1em',
                            color: '#000'
                        }}>
						{page.phone2}
					</Link>
				</Box>
				<Box
                    sx={{
                        flex: '1',
                        display: 'flex',
                        padding: '2em 1em',
                        bgcolor: '#fff',
                        alignItems: 'center'
                    }}>
					<Image
						title='Расположение '
						width={50}
						height={50}
						isOnSSR={false}
						src='/mark.png'
						alt='Расположение'
					></Image>
					<Typography sx={{ ml: '1em' }}>д. Полотково, Гродно 231710</Typography>
				</Box>
			</Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    marginBottom: { xs: '1em', md: '3em' }
                }}>
				<iframe
					style={{ flex: '1', minHeight: isMobile ? 400 : 500 }}
					loading='lazy'
					src='https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor'
					frameBorder='0'
				></iframe>
				<Box
                    sx={{
                        flex: '1',
                        marginBottom: { xs: '3em', md: '0' },
                        marginLeft: { xs: 0, md: '2em' }
                    }}>
					<Typography
						component='h2'
						variant='h5'
						sx={{ fontWeight: 500, mb: '1em', textTransform: 'uppercase' }}>
						{page.askTitle}
					</Typography>
					<Typography color='text.secondary' sx={{ mb: '1em' }}>
						<ReactMarkdown content={page.askText}></ReactMarkdown>
					</Typography>
					<Box component='form' onSubmit={throttledSubmit} sx={{ maxWidth: { xs: 'initial', md: '430px' } }}>
						<Box sx={{
                            marginBottom: '1em'
                        }}>
							<Input
								sx={{ background: '#fff', padding: '0.5em 1em', border: 'none' }}
								required
								onChange={handleChangeName}
								placeholder='Ваше имя'
								fullWidth
							></Input>
						</Box>
						<Box sx={{
                            marginBottom: '1em'
                        }}>
							<Input
								value={phone}
								onChange={handleChangePhone}
								required
								placeholder='Ваш телефон'
								sx={{ background: '#fff', padding: '0.5em 1em' }}
								fullWidth
								inputProps={{
									mask: '+375 00 000 00 00',
									unmask: true
								}}
							/>
						</Box>
						<Box sx={{
                            marginBottom: '1em'
                        }}>
							<Input
								required
								sx={{ background: '#fff', padding: '0.5em 1em' }}
								onChange={handleChangeMessage}
								placeholder='Интересуемый вопрос'
								multiline
								fullWidth
								rows={4}
							></Input>
						</Box>
						<Button fullWidth={isMobile} variant='contained' sx={{ padding: '0.5em 5em' }} type='submit'>
							Отправить
						</Button>
					</Box>
				</Box>
			</Box>
			<Typography component='h2' variant='h5' sx={{ textTransform: 'uppercase', mb: '1em' }}>
				{page.requisitesTitle}
			</Typography>
            <BlockImages
				withSlider={isMobile}
				withoutOverlay
				sx={{ margin: 0, padding: 0 }}
				images={page.requisites}
			></BlockImages>
            <BlockImages sx={{ marginBottom: '-2em' }} images={page.images}></BlockImages>
        </>
    );
};

export default Contacts;

export const getStaticProps = getPageProps(
	pageApi.fetchPage('contact', { populate: ['seo', 'images', 'requisites'] }),
	async () => {
		return {
			props: {
				breadcrumbs: [
					{ text: 'Главная', href: '/' },
					{ text: 'Контакты', href: '/contacts' }
				]
			}
		};
	}
);
