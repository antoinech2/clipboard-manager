import { Card, CardContent, Textarea, Typography, Button, Box, IconButton, Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Input, CardActions, Stack } from '@mui/joy';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { enqueueSnackbar, closeSnackbar } from 'notistack'
import { fileSize } from '../helper/fileSize';

export default function Note(props) {
    const { data, noActions = false } = props;
    const { id, content: text, date_created: date, date_modified: modified, title, file_name, file_size } = data

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [editState, setEditState] = useState(false);
    const [editedText, setEditedText] = useState(text ?? "");
    const [editedTitle, setEditedTitle] = useState(title ?? "");

    const textareaRef = useRef(null);

    useEffect(() => {
        setEditedText(text ?? "");
    }, [text]);

    const deleteNote = () => {
        axios.delete(API_URL + "/note/" + id)
            .then(function (response) {
                enqueueSnackbar("Note supprimée", { variant: 'warning', autoHideDuration: 7000, action: cancelDeleteAction(response.data) });
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
        const { file, file_name, file_size, ...sendingData } = data
        axios.post(API_URL + "/note", sendingData)
            .then(function (response) {
                enqueueSnackbar("Suppression de la note annulée !", { variant: 'warning', autoHideDuration: 4000 });
                closeSnackbar(snackbarId);
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'annulation de la suppression de la note", { variant: 'error', autoHideDuration: 5000 });
            });
    }

    const cancelEdit = () => {
        setEditState(false);
        setEditedText(text ?? "");
        setEditedTitle(title ?? "");
    }

    const confirmEdit = () => {
        axios.put(API_URL + "/note/" + id, {
            title: editedTitle,
            content: editedText
        })
            .then(function (response) {
                setEditState(false);
                enqueueSnackbar("Note modifiée", { variant: 'success', autoHideDuration: 4000 });
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de la modification de la note", { variant: 'error', autoHideDuration: 5000 });
            }
            );
    }

    const downloadFile = () => {
        axios.get(API_URL + "/note/" + id + "/file", { responseType: 'blob' })
            .then(function (response) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file_name);
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors du téléchargement du fichier", { variant: 'error', autoHideDuration: 5000 });
            });
    }

    const hasModification = (editedText !== text || editedTitle !== title);

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
                        textareaRef.current?.focus()
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
            <CardContent orientation="vertical">
                {(text || editState) && <Textarea
                    slotProps={{ textarea: { ref: textareaRef } }}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder='Description...'
                    readOnly={!editState}
                    sx={{ mb: 1 }}
                    endDecorator={
                        <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                            {!noActions && <Button variant="outlined" color="neutral" onClick={() => {
                                navigator.clipboard.writeText(editedText);
                                enqueueSnackbar("Copié !", { variant: 'info', autoHideDuration: 2000 });
                            }}>
                                Copier
                            </Button>}
                            <Typography level="body-xs" alignContent={'end'} sx={{ ml: "auto" }}>
                                {editedText.length} caractère(s)
                            </Typography>
                        </Box>
                    }
                />}
                {file_name && <Stack direction={"row"} alignItems={"center"} gap={3}>
                    <Typography level="body-ml">Fichier: ({fileSize(file_size)})</Typography>
                    <Button startDecorator={<FileDownloadIcon />} onClick={downloadFile}>{file_name}</Button>
                </Stack>}
            </CardContent>
            {editState && <CardActions buttonFlex="0 1 120px">
                <Button variant="soft" color="primary" sx={{ mr: "auto" }} onClick={cancelEdit}>
                    Annuler
                </Button>
                <Button variant="solid" color="primary" sx={{ ml: "auto" }} onClick={confirmEdit} disabled={!hasModification}>
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