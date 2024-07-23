import { Card, CardContent, Textarea, Typography, Button, Box, Snackbar, IconButton, Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions } from '@mui/joy';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

export default function Note(props) {
    const { id, text, date, title, noActions = false } = props;

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const deleteNote = () => {
        axios.delete(API_URL + "/note/" + id)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <Card>
            <div>
                <Typography level="title-lg" fontStyle={!title && "italic"}>{title ?? "Sans titre"}</Typography>
                <Typography level="body-sm">{date}</Typography>
                {!noActions && <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="danger"
                    size="md"
                    sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                    onClick={() => setConfirmationOpen(true)}
                >
                    <DeleteForever />
                </IconButton>}
            </div>
            <Textarea
                defaultValue={text}
                readOnly
                endDecorator={
                    <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                        {!noActions && <Button variant="outlined" color="neutral" onClick={() => { navigator.clipboard.writeText(text); setCopied(true) }}>
                            Copier
                        </Button>}
                        <Typography level="body-xs" alignContent={'end'} sx={{ ml: "auto" }}>
                            {text.length} caractère(s)
                        </Typography>
                    </Box>
                }
            />
            <CardContent orientation="horizontal">

            </CardContent>
            <Snackbar
                autoHideDuration={3000}
                color="success"
                size="md"
                invertedColors
                variant="solid"
                open={copied}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setCopied(false)
                }}
            >
                Copié !
            </Snackbar>
            <ConfirmationPopup open={confirmationOpen} setOpen={setConfirmationOpen} confirmAction={deleteNote} content={<Note noActions={true} {...props}/>}/>
        </Card>

    )
}

function ConfirmationPopup({open, setOpen, content, confirmAction}) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <WarningRoundedIcon />
                    Confirmation
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Voulez-vous supprimer définitivement le contenu suivant:
                    <div>
                        {content}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="danger" onClick={() => {setOpen(false); confirmAction()}}>
                        Supprimer
                    </Button>
                    <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}