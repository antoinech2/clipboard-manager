import { Card, CardContent, Textarea, Typography, Button, Box, Snackbar, Input, CardActions, } from '@mui/joy';
import { useState } from 'react';

export default function Note() {

    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        console.log('submit', e.target.title.value, e.target.content.value);
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Card variant="solid" color="primary" invertedColors>
                <Typography level="title-lg" >Nouvelle note</Typography>
                <Input placeholder="Titre" size="lg" color="primary" name='title' />
                <CardContent>
                    <Textarea
                        placeholder="Nouvelle note..."
                        name='content'
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        endDecorator={
                            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                                <Button variant="outlined" color="neutral" onClick={() => { navigator.clipboard.readText().then(clipboardText => setText(text + clipboardText)); setCopied(true) }}>
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
                <Snackbar
                    autoHideDuration={1500}
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
                    Collé !
                </Snackbar>
            </Card>
        </form>
    )
}
