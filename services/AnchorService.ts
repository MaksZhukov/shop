export const getCatalogAnchor = (
	pathname: string,
	brandName?: string,
	modelName?: string,
	kindSparePartName?: string
) => {
	let str = '/' + pathname.split('/')[1];
	if (brandName && modelName && kindSparePartName) {
		return str + `/${brandName}/model-${modelName}`;
	} else if ((brandName && modelName && !kindSparePartName) || (brandName && kindSparePartName)) {
		return str + `/${brandName}`;
	}
	return str;
};

export const getCatalogAnchorText = (brandName?: string, modelName?: string, kindSparePartName?: string) => {
	if (brandName && modelName && kindSparePartName) {
		return brandName + ' ' + modelName;
	} else if ((brandName && modelName && !kindSparePartName) || (brandName && kindSparePartName)) {
		return `${brandName}`;
	}
	return 'Запчасти';
};
