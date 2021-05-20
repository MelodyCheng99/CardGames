import { Card, CardContent, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

import React, { useContext, useState } from 'react'
import socketIOClient from 'socket.io-client';

import { SocketContext } from '../../App.js'

const useStyles = makeStyles({
    box: {
        width: 250,
        height: 180
    },
    nameInput: {
        marginTop: 10,
        marginBottom: 15
    }
})

function EnterName({ setEnteredName }) {
    const classes = useStyles();
    const socket = useContext(SocketContext);
    const [name, setName] = useState('');

    return (
        <Card className={classes.box} variant="outlined">
            <CardContent>
                <Typography>你叫什麼名字?</Typography>
                <TextField
                    className={classes.nameInput}
                    variant="outlined"
                    onChange={(event: object) => setName(event.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEnteredName(true);
                        socket.emit('enterName', name)
                    }}
                >
                    提交
                </Button>
            </CardContent>
        </Card>
    )
}

export default EnterName