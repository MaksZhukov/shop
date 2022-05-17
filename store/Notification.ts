import { SnackbarCloseReason } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { ReactElement, ReactNode } from "react";
import RootStore from ".";


interface Notification {
    open?: boolean;
    message: ReactNode;
    content?: ReactElement;
    onClose?: (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => void;
}


export default class NotificationStore implements Notification {
    root: RootStore;

    open: boolean = false;
    message: ReactNode = '';
    content?: ReactElement | undefined;
    onClose?: (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => void | undefined;

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
    showMessage({ message, onClose, content }: Notification) {
        this.open = true;
        this.message = message;
        this.content = content;
        this.onClose = onClose;
    }
    closeMessage() {
        this.open = false;
    }
}