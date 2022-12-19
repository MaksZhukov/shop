import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { FC, useEffect, useMemo, useState } from 'react';

const generatePathParts = (pathStr: string) => {
	const pathWithoutQuery = pathStr.split('?')[0];
	return pathWithoutQuery.split('/').filter((v) => v.length > 0);
};

let PATH_NAMES = {
	articles: 'Статьи',
	'spare-parts': 'Запчасти',
	wheels: 'Диски',
	cabins: 'Салоны',
	tires: 'Шины',
	'how-to-get-to': 'Как добраться',
	'service-stations': 'СТО',
	profile: 'Профиль',
	'installment-plan': 'Рассрочка',
	guarantee: 'Гарантия',
	favorites: 'Избранные',
	delivery: 'Доставка',
	contacts: 'Контакты',
	'company-photo': 'Фото разборки',
	'car-dismantling-photos': 'Фото/вид разборки',
	'awaiting-cars': 'Ожидаемые авто',
	autocomises: 'Автокомисы',
	vacancies: 'Вакансии',
	'cars-on-parts': 'Авто на запчасти',
	about: 'О нас',
	payment: 'Оплата',
};

interface Props {
	h1?: string;
}

const Breadcrumbs: FC<Props> = ({ h1 }) => {
	const router = useRouter();

	const breadcrumbs = useMemo(
		function generateBreadcrumbs() {
			const asPathNestedRoutes = generatePathParts(router.asPath);
			const pathnameNestedRoutes = generatePathParts(router.pathname);
			const crumblist = asPathNestedRoutes.map((subpath, idx) => {
				const param = pathnameNestedRoutes[idx].replace('[', '').replace(']', '');
				const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
				return {
					href,
					text: param.includes('brand')
						? subpath.replaceAll('-', ' ')
						: param === 'slug'
						? h1 ?? subpath
						: PATH_NAMES[subpath as keyof typeof PATH_NAMES] ?? subpath,
				};
			});

			return [{ href: '/', text: 'Главная' }, ...crumblist];
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath, router.pathname, router.query]
	);

	return (
		<MUIBreadcrumbs sx={{ marginBottom: '1em' }} aria-label='breadcrumb'>
			{breadcrumbs.length > 1 &&
				breadcrumbs.map((crumb, idx) =>
					idx === breadcrumbs.length - 1 ? (
						<Typography key={crumb.text} color='text.secondary'>
							{crumb.text}
						</Typography>
					) : (
						<NextLink key={crumb.text} href={crumb.href}>
							<Link component='span' underline='hover' color='primary.main'>
								{crumb.text}
							</Link>
						</NextLink>
					)
				)}
		</MUIBreadcrumbs>
	);
};

export default Breadcrumbs;
