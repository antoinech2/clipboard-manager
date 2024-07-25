import { Card, CardContent, Textarea, Typography, Button, Box, Input, CardActions, IconButton, Stack } from '@mui/joy';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/joy';
import { fileSize } from '../helper/fileSize';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function NewNote() {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        e.target.title.value && formData.append('title', e.target.title.value);
        e.target.content.value && formData.append('content', e.target.content.value);
        file && formData.append('file', file, file.name);


        axios.post(API_URL + "/note", formData)
            .then(function (response) {
                setText('');
                setTitle('');
                setFile(null);
                enqueueSnackbar("Note ajoutée !", { variant: 'success', autoHideDuration: 7000, action: cancelAddAction(response.data.id) });
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'ajout de la note", { variant: 'error', autoHideDuration: 5000 });
            })
            .finally(() => setLoading(false));
    }

    const cancelAddAction = id => snackbarId => (
        <>
            <Button color="secondary" size="small" sx={{ ml: "auto" }} onClick={() => cancelAdd(id, snackbarId)}>
                Annuler
            </Button>
        </>
    );

    const cancelAdd = (id, snackbarId) => {
        axios.delete(API_URL + "/note/" + id)
            .then(function (response) {
                enqueueSnackbar("Ajout de la note annulé !", { variant: 'warning', autoHideDuration: 4000 });
                closeSnackbar(snackbarId);
                setText(response.data.content ?? "");
                setTitle(response.data.title ?? "");
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'annulation l'ajout de la note", { variant: 'error', autoHideDuration: 5000 });
            });
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const fileTooLarge = file && file.size > 1024 * 1024 * 10;

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Card variant="solid" color="primary" invertedColors>
                <Typography level="title-lg" >Nouvelle note</Typography>
                <Input placeholder="Titre" size="lg" color="primary" name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                <CardContent>
                    <Textarea
                        placeholder="Nouvelle note..."
                        name='content'
                        required={!file && true}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        endDecorator={
                            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                                <Button variant="outlined" color="neutral" onClick={() => {
                                    navigator.clipboard.readText().then(clipboardText => setText(text + clipboardText));
                                    enqueueSnackbar("Collé", { variant: 'info', autoHideDuration: 2000 });
                                }}>
                                    Coller
                                </Button>
                                <Typography level="body-xs" alignContent={'end'} sx={{ ml: "auto" }}>
                                    {text.length} caractère(s)
                                </Typography>
                            </Box>
                        }
                    />
                    <Button
                        component="label"
                        variant="soft"
                        startDecorator={<FileUploadIcon />}
                        sx={{ mt: 1 }}
                    >
                        Téléverser un fichier
                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                    </Button>
                    {file && <Stack direction={"row"} alignItems={"center"} gap={1}>
                        <IconButton onClick={() => setFile(null)}>
                            <ClearIcon/>
                        </IconButton>
                        <Typography level="body-ml">Fichier: {file.name} ({fileSize(file.size)})</Typography>
                        {fileTooLarge && <Typography sx={{ml: "auto"}} variant="solid" color="danger">Fichier trop volumineux (Max 10 Mo)</Typography>}
                    </Stack>}
                </CardContent>
                <CardActions buttonFlex="0 1 120px" sx={{mt: -1}}>
                    <Button variant="solid" color="primary" sx={{ ml: "auto" }} type='submit' disabled={fileTooLarge} loading={loading}>
                        Envoyer
                    </Button>
                </CardActions>
            </Card>
        </form>
    )
}
