import { Modal, Box, Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useState } from 'react'
import { SocketContext } from '../../App'

const useStyles = makeStyles({
    gameConfigModalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameConfigModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '300px',
        width: '400px',
        backgroundColor: '#52b2bf',
        borderRadius: '8px'
    },
    startGameButton: {
        marginTop: '30px'
    }
})

const GameConfigModal = ({ open, setOpenGameConfigModal, players }) => {
    const classes = useStyles()
    const socket = useContext(SocketContext)

    const [numCards, setNumCards] = useState()
    const intNumCards = parseInt(numCards)

    return (
        <Modal
            className={classes.gameConfigModalContainer}
            open={open}
        >
            <Box className={classes.gameConfigModal}>
                <Typography>每個玩家要發多少張牌?</Typography>
                <TextField
                    variant="outlined"
                    onChange={(event) => setNumCards(event.target.value)}
                />
                <Button
                    className={classes.startGameButton}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setOpenGameConfigModal(false)
                        socket.emit('startGame', intNumCards)
                    }}
                    disabled={!intNumCards || Math.ceil(52 / players.length) < intNumCards}
                >
                    玩呀玩呀玩呀
                </Button>
            </Box>
        </Modal>
    )
}

export default GameConfigModal
