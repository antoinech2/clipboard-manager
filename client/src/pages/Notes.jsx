import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '../constants';
import Note from '../components/Note';
import { Stack } from '@mui/joy';
import NewNote from '../components/NewNote';

export default function Notes() {

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        async function getResults() {
            const results = await axios(API_URL + "/note");
            setNotes(results.data)
        }
        getResults()
    }, []);

    return (
        <Stack spacing={2}>
            <NewNote setNotes={setNotes}/>
            {
                notes.map((note) => {
                    return (
                        <Note key={note.id} id={note.id} title={note.title} date={note.date_created} text={note.content} setNotes={setNotes}/>
                    )
                })
            }
        </Stack>
    )
}