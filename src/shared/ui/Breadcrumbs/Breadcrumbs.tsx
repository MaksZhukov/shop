import { Box, Container, Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import { Link } from 'shared/ui/Link';
import { FC } from 'react';
import { BreadcrumbItem } from './breadcrumbsTypes';

interface Props {
	breadcrumbs: BreadcrumbItem[];
}

export const Breadcrumbs: FC<Props> = ({ breadcrumbs }) => {
	if (!breadcrumbs || breadcrumbs.length === 0) {
		return <></>;
	}

	const renderSeparator = (
		<Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'custom.muted-foreground' }} />
	);

	return (
        <Container>
            <MUIBreadcrumbs separator={renderSeparator} sx={{ marginY: '1em' }} aria-label='breadcrumb'>
				{breadcrumbs.map((crumb: BreadcrumbItem, idx: number) =>
					idx === breadcrumbs.length - 1 ? (
						<Typography
                            key={crumb.text}
                            sx={{
                                textTransform: 'capitalize',
                                color: 'text.secondary'
                            }}>
							{crumb.text}
						</Typography>
					) : (
						<Link
							key={crumb.text}
							href={crumb.href}
							color='custom.text-muted'
							sx={{ textTransform: 'capitalize' }}
						>
							{crumb.text}
						</Link>
					)
				)}
			</MUIBreadcrumbs>
        </Container>
    );
};
