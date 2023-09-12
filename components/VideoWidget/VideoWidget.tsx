import { Box } from '@mui/material';
import { useState, FC } from 'react';
import styles from './VideoWidget.module.scss';
import classNames from 'classnames';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import IconButton from '@mui/material/IconButton';
import dynamic from 'next/dynamic';
import { Image, Video } from 'api/types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	video: Video;
}

const VideoWidget: FC<Props> = ({ video }) => {
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(true);
	const handleClick = () => {
		setIsPreview(!isPreview);
		setIsMuted(false);
	};
	return (
		<Box
			className={classNames(styles.wrapper, !isPreview && styles['wrapper_no-preview'])}
			left={30}
			bottom={30}
			zIndex={10}
			width={isPreview ? 320 : 130}
			height={isPreview ? 500 : 180}
			position='fixed'
			bgcolor='#fff'
			borderRadius={5}
			border='3px solid #fff'
			boxShadow='0px 5px 15px rgba(0,0,0,0.2)'
		>
			<IconButton size={'small'} className={styles.btn} onClick={handleClick}>
				{isPreview ? <FullscreenExitIcon></FullscreenExitIcon> : <FullscreenIcon></FullscreenIcon>}
			</IconButton>
			<ReactPlayer
				playing
				config={{
					file: {
						attributes: {
							controlslist: 'nofullscreen'
						}
					}
				}}
				muted={isMuted}
				className={styles.player}
				controls
				width={'100%'}
				height={'100%'}
				url={publicRuntimeConfig.backendUrl + video.url}
			></ReactPlayer>
		</Box>
	);
};

export default VideoWidget;
