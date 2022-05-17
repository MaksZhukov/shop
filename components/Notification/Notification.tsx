import { Snackbar } from '@mui/material';
import { observer } from 'mobx-react';
import { useStore } from '../../store';

const Notification = observer(() => {
    const store = useStore();
    return (
        <Snackbar
            onClose={store.notification.onClose}
            message={store.notification.message}
            open={store.notification.open}>
            {store.notification.content}
        </Snackbar>
    );
});

export default Notification;
