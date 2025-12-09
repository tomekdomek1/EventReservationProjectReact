import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import React from "react";

interface GenericDialogProps {
    trigger: React.ReactElement<{ onClick?: () => void }>;
    title?: string | React.ReactNode;
    content: string | React.ReactNode;
    onConfirm: () => void;
    hideActions?: boolean;
    confirmText?: string;
    cancelText?: string;

}

export default function GenericDialog({
    trigger,
    title,
    content,
    onConfirm,
    confirmText = 'Agree',
    cancelText = 'Disagree',
    hideActions = false
}: GenericDialogProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        onConfirm?.();
        handleClose();
    };

    const dialogTrigger = React.cloneElement(trigger, { onClick: handleClickOpen });

    // jeśli content jest React elementem → wstrzykujemy mu callback
    const dialogContent = React.isValidElement(content)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? React.cloneElement(content as any, { onDialogClose: handleClose })
        : content;

    return (
        <>
            {dialogTrigger}
            <Dialog open={open} onClose={handleClose} fullWidth>
                {title && <DialogTitle>{title}</DialogTitle>}
                <DialogContent>
                    {typeof dialogContent === 'string' ?    
                        <DialogContentText>
                            {dialogContent}
                        </DialogContentText> :
                        <div>
                            {dialogContent}
                        </div>
                    }
                </DialogContent>

                {!hideActions && (
                    <DialogActions>
                        <Button onClick={handleClose}>{cancelText}</Button>
                        <Button onClick={handleConfirm}>{confirmText}</Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
}
