import { AnyQuestionsLeft, WhiteBox } from 'shared/ui';

export const MobileQuestionsSection: React.FC = () => {
	return (
		<WhiteBox display={{ xs: 'block', md: 'none' }} borderRadius={0} ml={-2} mr={-2} pt={3} pb={1} mt={3} px={1}>
			<AnyQuestionsLeft />
		</WhiteBox>
	);
};
