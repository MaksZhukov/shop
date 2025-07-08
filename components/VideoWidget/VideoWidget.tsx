import { Box, useMediaQuery } from '@mui/material';
import { useState, FC } from 'react';
import styles from './VideoWidget.module.scss';
import classNames from 'classnames';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';
import { Image, Video } from 'api/types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	video: Video;
}

const VideoWidget: FC<Props> = ({ video }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [show, setShow] = useState<boolean>(true);
	const [isMuted, setIsMuted] = useState<boolean>(true);
	const handleClick = () => {
		setIsPreview(!isPreview);
		setIsMuted(false);
	};

	const handleClose = () => {
		setShow(false);
	};
	return show ? (
		<Box
			className={classNames(styles.wrapper, !isPreview && styles['wrapper_no-preview'])}
			left={40}
			bottom={20}
			zIndex={10}
			width={isPreview ? (isMobile ? 250 : 320) : 130}
			height={isPreview ? 500 : 180}
			position='fixed'
			bgcolor='#fff'
			borderRadius={5}
			border='3px solid #fff'
			boxShadow='0px 5px 15px rgba(0,0,0,0.2)'
		>
			<IconButton color='primary' size={'small'} className={styles['btn-close']} onClick={handleClose}>
				<CloseIcon></CloseIcon>
			</IconButton>
			<IconButton color='primary' size={'small'} className={styles.btn} onClick={handleClick}>
				{isPreview ? <FullscreenExitIcon></FullscreenExitIcon> : <FullscreenIcon></FullscreenIcon>}
			</IconButton>
			<ReactPlayer
				playing
				controlsList='nofullscreen'
				muted={isMuted}
				className={styles.player}
				controls
				width={'100%'}
				height={'100%'}
				src={publicRuntimeConfig.backendUrl + video.url}
			></ReactPlayer>
		</Box>
	) : (
		<></>
	);
};

export default VideoWidget;
