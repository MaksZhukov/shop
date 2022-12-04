const VIDEO_FORMATS = ['.mp4', '.mpeg', '.avi', '.wmv'];

const rehypeVideo = () => {
	return (tree: any) => {
		tree.children.forEach((item: any) => {
			if (item.type === 'element') {
				item.children.forEach((child: any) => {
					if (
						child.type === 'element' &&
						child.tagName === 'a' &&
						VIDEO_FORMATS.some((format) => child.properties.href.endsWith(format))
					) {
						child.tagName = 'video';
						child.properties.src = child.properties.href;
						delete child.properties.href;
					}
				});
			}
		});
	};
};

export default rehypeVideo;
