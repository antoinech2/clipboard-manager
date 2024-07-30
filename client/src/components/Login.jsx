import { Card, CardContent, Textarea, Typography, Button, Box, IconButton, Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Input, CardActions, Stack } from '@mui/joy';
import axios from 'axios';


export default function Login({setPassword}){

    const handleLogin = (e) => {
        e.preventDefault();
        setPassword(btoa(e.target.password.value));
        axios.defaults.headers.common['Authorization'] = `Basic ${btoa(e.target.password.value)}` 
    }

    return(
        <Card>
            <CardContent>
                <Typography level="h3" component="h1" mr={"auto"} ml={"auto"} mb={2}>
                    Enter password to see notes
                </Typography>
                <form onSubmit={handleLogin}>
                    <Stack spacing={2}>
                        <Input type="password" name="password" placeholder="Password" />
                        <Button variant="soft" color="warning" type='submit'>
                            Login
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )
}