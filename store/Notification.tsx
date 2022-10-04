import { Alert, SnackbarCloseReason } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { ReactElement, ReactNode } from "react";
import RootStore from ".";

interface ShowMessage {
  message?: string;
  timeout?: number;
  onClose?: () => void;
  content?: ReactElement;
}

interface Notification {
  timerId: null | number;
  open?: boolean;
  message: ReactNode;
  content?: ReactElement;
  onClose?: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void;
  showMessage: (arg: ShowMessage) => void;
  showErrorMessage: (content: ReactNode) => void;
}

export default class NotificationStore implements Notification {
  root: RootStore;

  timerId: null | number = null;
  open: boolean = false;
  message: ReactNode = "";
  content?: ReactElement | undefined;
  onClose?: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void | undefined;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  showMessage({ message, content, onClose, timeout = 3000 }: ShowMessage) {
    this.open = true;
    this.message = message;
    this.content = content;
    this.onClose = onClose;
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = window.setTimeout(() => {
      this.closeMessage();
    }, timeout);
  }
  showSuccessMessage(content: ReactNode) {
    this.showMessage({
      content: <Alert variant="filled">{content}</Alert>,
    });
  }
  showErrorMessage(content: ReactNode) {
    this.showMessage({
      content: (
        <Alert variant="filled" security="error">
          {content}
        </Alert>
      ),
    });
  }
  closeMessage() {
    this.open = false;
  }
}
