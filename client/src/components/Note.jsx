import { Card, CardContent, Textarea, Typography, Button, Box, IconButton, Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions } from '@mui/joy';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { enqueueSnackbar, closeSnackbar } from 'notistack'

export default function Note(props) {
    const { id, text, date, title, setNotes, noActions = false } = props;

    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const deleteNote = () => {
        axios.delete(API_URL + "/note/" + id)
        .then(function (response) {
            enqueueSnackbar("Note supprimée", { variant: 'warning', autoHideDuration: 7000, action: cancelDeleteAction(response.data) });
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        })
        .catch(function (error) {
            console.log(error);
            enqueueSnackbar("Erreur lors de la suppression de la note", { variant: 'error', autoHideDuration: 5000 });
        });
    }

    const cancelDeleteAction = data => snackbarId => (
        <>
            <Button color="secondary" size="small" sx={{ ml: "auto" }} onClick={() => cancelDelete(data, snackbarId)}>
                Annuler
            </Button>
        </>
    );

    const cancelDelete = (data, snackbarId) => {
        axios.post(API_URL + "/note", data)
            .then(function (response) {
                enqueueSnackbar("Suppression de la note annulée !", { variant: 'warning', autoHideDuration: 4000 });
                setNotes(prevNotes => [response.data, ...prevNotes]);
                closeSnackbar(snackbarId);
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'annulation de la suppression de la note", { variant: 'error', autoHideDuration: 5000 });
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
                        {!noActions && <Button variant="outlined" color="neutral" onClick={() => {
                            navigator.clipboard.writeText(text); 
                            enqueueSnackbar("Copié !", { variant: 'info', autoHideDuration: 2000});
                        }}>
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