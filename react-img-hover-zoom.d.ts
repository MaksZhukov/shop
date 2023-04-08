import { CSSProperties } from 'react';
declare module 'react-img-hover-zoom' {
    interface Props {
        img: string;
        zoomScale: number;
        width: SafeNumber;
        height: SafeNumber;
        style: CSSProperties;
        className?: string;
    }
    declare class Zoom extends React.Component<Props, never> {}
    export default Zoom;
}
