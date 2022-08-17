import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import styles from './Footer.module.scss';

const Footer = () => {
    let date = new Date();
    return (
        <footer className={styles.footer}>
            <Container>
                <Typography variant="h6" component="h6">
                    ЦЕНТР ОБСЛУЖИВАНИЯ КЛИЕНТОВ: +375-29-780-4-780, +375-29-601-16-02, +375-29-888-32-33
                </Typography>
                <Typography margin="0.5em 0" component="p">
                    ООО &quot;Дриблинг&quot;, 2009-2017. УНП 590740644 . Дата регистрации 03.11.2008.
                </Typography>
                <Typography margin="0.5em 0" component="p">
                    Адрес: Республика Беларусь, Гродненская область, Гродненский район. д. Полотково
                </Typography>
                <Typography margin="0.5em 0" component="p">
                    © {date.getFullYear()} - Авторазборка Полотково
                </Typography>
            </Container>
        </footer>
    );
};

export default Footer;
