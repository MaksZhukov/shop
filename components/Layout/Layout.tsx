import { ReactNode } from 'react';
import styles from './Layout.module.scss';

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    return <div className={styles.layout}>{children}</div>;
};

export default Layout;
