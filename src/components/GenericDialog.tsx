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

export function GenericDialog({
    trigger,
    title,
    content,
    onConfirm,
    confirmText = 'Agree',
    cancelText = 'Disagree',
    hideActions = false
}: GenericDialogProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleClose();
    };

    const dialogTrigger = React.cloneElement(trigger, {
        onClick: handleClickOpen,
    });

    return (
        <React.Fragment>
            {dialogTrigger}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="generic-dialog-title"
                aria-describedby="generic-dialog-description"
            >
                {title && (
                    <DialogTitle id="generic-dialog-title">
                        {title}
                    </DialogTitle>
                )}
                <DialogContent>
                    <DialogContentText id="generic-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                {
                    hideActions === false ? (
                        <DialogActions>
                            <Button onClick={handleClose} autoFocus>
                                {cancelText}
                            </Button>
                            <Button onClick={handleConfirm}>
                                {confirmText}
                            </Button>
                        </DialogActions>
                    ) : ''
                }
            </Dialog>
        </React.Fragment>
    );
}

export default GenericDialog;
