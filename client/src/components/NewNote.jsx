import { Card, CardContent, Textarea, Typography, Button, Box, Input, CardActions } from '@mui/joy';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { closeSnackbar, enqueueSnackbar } from 'notistack'

export default function NewNote({setNotes}) {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(API_URL + "/note", {
            ...(e.target.title.value !== "" && { title: e.target.title.value }),
            content: e.target.content.value
        })
            .then(function (response) {
                setText('');
                setTitle('');
                setNotes(prevNotes => [response.data, ...prevNotes]);
                enqueueSnackbar("Note ajoutée !", { variant: 'success', autoHideDuration: 7000, action: cancelAddAction(response.data.id) });
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'ajout de la note", { variant: 'error', autoHideDuration: 5000 });
            });
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
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
                setText(response.data.content);
                setTitle(response.data.title);
            })
            .catch(function (error) {
                console.error(error);
                enqueueSnackbar("Erreur lors de l'annulation l'ajout de la note", { variant: 'error', autoHideDuration: 5000 });
            });
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Card variant="solid" color="primary" invertedColors>
                <Typography level="title-lg" >Nouvelle note</Typography>
                <Input placeholder="Titre" size="lg" color="primary" name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                <CardContent>
                    <Textarea
                        placeholder="Nouvelle note..."
                        name='content'
                        required
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

                </CardContent>
                <CardActions buttonFlex="0 1 120px">
                    <Button variant="solid" color="primary" sx={{ ml: "auto" }} type='submit'>
                        Envoyer
                    </Button>
                </CardActions>
            </Card>
        </form>
    )
}
