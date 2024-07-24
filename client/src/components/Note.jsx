import { Card, CardContent, Textarea, Typography, Button, Box, IconButton, Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Input, CardActions, Stack } from '@mui/joy';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { enqueueSnackbar, closeSnackbar } from 'notistack'

export default function Note(props) {
    const { id, text, date, modified, title, setNotes, noActions = false } = props;

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [editState, setEditState] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const [editedTitle, setEditedTitle] = useState(title ?? "");

    const textareaRef = useRef(null);

    useEffect(() => {
        setEditedText(text);
    }, [text]);

    const deleteNote = () => {
        axios.delete(API_URL + "/note/" + id)
            .then(function (response) {
                enqueueSnackbar("Note supprimée", { variant: 'warning', autoHideDuration: 7000, action: cancelDeleteAction(response.data) });
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            })
            .catch(function (error) {
                console.error(error);
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

    const cancelEdit = () => {
        setEditState(false);
        setEditedText(text);
        setEditedTitle(title);
    }

    const confirmEdit = () => {
        axios.put(API_URL + "/note/" + id, {
            title: editedTitle,
            content: editedText
        })
            .then(function (response) {
                setEditState(false);
                setNotes(prevNotes => prevNotes.map(note => note.id === id ? response.data : note));
                enqueueSnackbar("Note modifiée", { variant: 'success', autoHideDuration: 4000 });
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de la modification de la note", { variant: 'error', autoHideDuration: 5000 });
            }
            );
    }

    return (
        <Card>
            <div>
                {editState ?
                    <Input placeholder="Titre" size="lg" color="primary" name='title' value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    :
                    <Typography level="title-lg" fontStyle={!title && "italic"}>{title ?? "Sans titre"}</Typography>
                }
                <Stack direction="row" spacing={3}>
                    <Typography level="body-sm">Crée le {new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                    }).format(new Date(date))}</Typography>
                    {modified && <Typography level="body-sm" fontStyle={"italic"}>Modifié le {new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                    }).format(new Date(modified))}</Typography>}
                </Stack>
                {!editState && !noActions && <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="neutral"
                    sx={{ position: 'absolute', top: '0.875rem', right: '3rem' }}
                    onClick={() => {
                        setEditState(true)
                        textareaRef.current.focus()
                    }}
                >
                    <EditIcon />
                </IconButton>}
                {!editState && !noActions && <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="danger"
                    sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                    onClick={() => setConfirmationOpen(true)}
                >
                    <DeleteForever />
                </IconButton>}
            </div>
            <Textarea
                slotProps={{ textarea: { ref: textareaRef } }}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                readOnly={!editState}
                endDecorator={
                    <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                        {!noActions && <Button variant="outlined" color="neutral" onClick={() => {
                            navigator.clipboard.writeText(text);
                            enqueueSnackbar("Copié !", { variant: 'info', autoHideDuration: 2000 });
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
            {editState && <CardActions buttonFlex="0 1 120px">
                <Button variant="soft" color="primary" sx={{ mr: "auto" }} onClick={cancelEdit}>
                    Annuler
                </Button>
                <Button variant="solid" color="primary" sx={{ ml: "auto" }} onClick={confirmEdit}>
                    Modifier
                </Button>
            </CardActions>}
            <ConfirmationPopup open={confirmationOpen} setOpen={setConfirmationOpen} confirmAction={deleteNote} content={<Note noActions={true} {...props} />} />
        </Card>

    )
}

function ConfirmationPopup({ open, setOpen, content, confirmAction }) {
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
                    <Button variant="solid" color="danger" onClick={() => { setOpen(false); confirmAction() }}>
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