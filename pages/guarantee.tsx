import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import WhiteBox from 'components/WhiteBox';

const Guarantee = () => {
	return (
		<Container>
			<WhiteBox>
				<Typography component='h1' variant='h4' textAlign='center'>
					Гарантия
				</Typography>
				<Typography gutterBottom variant='h6'>
					{' '}
					Условия гарантии:
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					Гарантия на б/у запчасти, приобретенные на авторазборке
					Полотково в Гродно, составляет <b>14</b> календарных дней.
				</Typography>
				<Typography gutterBottom variant='h6'>
					Гарантия распространяется на:
				</Typography>
				<Typography paddingLeft='1em' gutterBottom variant='subtitle1'>
					двигатель <br></br> навесное оборудование <br></br>
					электронные механизмы <br></br> электронные блоки <br></br>
					МКПП/АКПП<br></br> колёсные диски
				</Typography>
				<Typography gutterBottom variant='h6'>
					Гарантия не распространяется на:
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					детали подвески, радиаторы, оптику, стекла, кузовные детали,
					колеса, шины, зеркала, фары, фонари, проводку, пластиковые
					детали салона, различного рода обшивки, на прокладки,
					сальники, ремни ГРМ, ролики, а так же любые резиновые
					детали, входящие в состав агрегата, салона и прочие детали.
					товары, проданные с дефектами, о которых покупатель был
					предупрежден перед покупкой.
				</Typography>
				<Typography gutterBottom variant='h6'>
					Возврат и обмен
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					Стандартный срок возврата запчастей составляет 14
					календарных дней со дня покупки. товара.
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					На протяжении гарантийного срока товар подлежит бесплатному
					обмену на аналогичный или может быть осуществлен возврат
					стоимости
				</Typography>
				<Typography gutterBottom variant='h6'>
					Специальные отметки
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					При приобретении сложных б/у запчастей, таких, как: коробки
					передач, коробки раздаточные, редукторы, детали двигателей,
					детали навесного оборудования двигателей, электронные блоки
					- специалисты нашей организации наносят специальные отметки
					краской.
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					При установке деталей на автомобиль, запрещается смывать,
					уничтожать, снимать или частично повреждать эти отметки. В
					противном случае претензии по качеству запасных частей
					рассматриваться не будут, денежные средства не возвращаются!
				</Typography>
				<Typography gutterBottom variant='h6'>
					Возврат запчастей осуществляется при выполнении следующих
					условий:
				</Typography>
				<Typography paddingLeft='1em' gutterBottom variant='subtitle1'>
					сохранение внешнего вида <br></br> сохранение защитных пломб{' '}
					<br></br> сохранение маркировки <br></br> комплектность{' '}
					<br></br>
					имеются доказательства приобретения на гродненской
					авторазборке Полотково
				</Typography>
				<Typography gutterBottom variant='h6'>
					Товар возврату не подлежит в случае:
				</Typography>
				<Typography paddingLeft='1em' gutterBottom variant='subtitle1'>
					истечения гарантийного срока <br></br> отсутствия
					(повреждении) меток продавца <br></br> отсутствия или утери
					чека <br></br> неправильной установки б/у детали, что
					привело к её поломке.
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					В случае возврата приобретённых б/у запчастей, затраты
					клиента, связанные с его установкой и транспортировкой,
					авторазборка Полотково в Гродно не компенсирует.
				</Typography>
			</WhiteBox>
		</Container>
	);
};

export default Guarantee;

export async function getStaticProps() {
	return { props: {} };
}
