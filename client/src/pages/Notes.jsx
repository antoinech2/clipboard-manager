import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '../constants';
import Note from '../components/Note';

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
        <>
            {
                notes.map((note, index) => {
                    return (
                        <Note key={index} id={note.id} title={note.title} date={note.date_created} text={note.content} />
                    )
                })
            }
        </>
    )
}