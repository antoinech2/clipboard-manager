import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import Note from '../components/Note';
import { Stack } from '@mui/joy';
import NewNote from '../components/NewNote';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../constants';

export default function Notes() {

    const [notes, setNotes] = useState([]);

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage?.type === "notes") {
            setNotes(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        async function getResults() {
            const results = await axios(API_URL + "/note");
            setNotes(results.data)
        }
        getResults()
    }, []);

    return (
        <Stack spacing={2}>
            <NewNote/>
            {
                notes.map((note) => {
                    return (
                        <Note key={note.id} data={note} />
                    )
                })
            }
        </Stack>
    )
}