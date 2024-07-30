import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import Note from '../components/Note';
import { Stack } from '@mui/joy';
import NewNote from '../components/NewNote';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../constants';
import Login from '../components/Login';

export default function Notes() {

    const [notes, setNotes] = useState([]);
    const [password, setPassword] = useState(null);

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage?.type === "notes") {
            setNotes(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        axios.get(API_URL + "/note")
            .then((response) => {
                setNotes(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setNotes(null);
                }
                else {
                    console.error(error);
                }
            });
    }, [password]);

    return (
        <Stack spacing={2}>
            <NewNote />
            {notes ?
                notes.map((note) => {
                    return (
                        <Note key={note.id} data={note} />
                    )
                })
                :
                <Login setPassword={setPassword}/>
            }
        </Stack>
    )
}