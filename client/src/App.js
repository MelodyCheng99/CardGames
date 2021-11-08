import { Card, CardContent, Typography, Button, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import socketIOClient from 'socket.io-client';

import { EnterName } from './components/enterName'
import { PlayingCard } from './components/playingCard'
import { History } from './components/history'
import { GameConfigModal } from './components/gameConfigModal'

const useStyles = makeStyles({
    enterNameBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
        width: '100%'
    },
    playersBox: {
        marginTop: 10,
        marginLeft: 10,
        width: 250,
        height: 200
    },
    startGameButton: {
        marginLeft: 10,
        marginTop: 10,
        width: 250
    },
    cards: {
        display: 'flex',
        alignItems: 'flex-end',
        height: '550px',
        maxWidth: '100%',
        overflow: 'auto'
    },
    card: {
        display: 'flex',
        flexDirection: 'column'
    },
    cardsPile: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    upperSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export const SocketContext = React.createContext();

function App() {
    const classes = useStyles();
    const [socket, setSocket] = useState(undefined);
    const [players, setPlayers] = useState([]);
    const [cards, setCards] = useState([]);
    const [cardsPlayed, setCardsPlayed] = useState([]);
    const [enteredName, setEnteredName] = useState(false);
    const [history, setHistory] = useState([]);
    const [openGameConfigModal, setOpenGameConfigModal] = useState(false);
    const [deck, setDeck] = useState([]);

    useEffect(() => {
        setSocket(socketIOClient(
            'http://127.0.0.1:4001',
            { transports: ['websocket', 'polling', 'flashsocket'] }
        ));
    }, []);

    useEffect(() => {
        socket && socket.on('playerEntered', (name) => {
            setPlayers(players => [...players, name]);
        });

        socket && socket.on('cardsDealt', (dealtCards, undealtCards) => {
            setCards(dealtCards);
            undealtCards && setDeck(undealtCards);
        })
    }, [socket]);

    useEffect(() => {
        socket && socket.on('cardPlayed', (cardPlayed) => {
            let cardsPlayedToUpdate = [...cardsPlayed]
            cardsPlayedToUpdate.push(cardPlayed)
            setCardsPlayed(cardsPlayedToUpdate);
        })

        socket && socket.on('cardWithdrawn', (cardWithdrawn) => {
            let cardsPlayedToUpdate = [...cardsPlayed]
            let cardsPlayedToUpdateIdx = 0
            for (const cardPlayed of cardsPlayedToUpdate) {
                if (cardPlayed.color === cardWithdrawn.color &&
                    cardPlayed.suit === cardWithdrawn.suit &&
                    cardPlayed.value === cardWithdrawn.value) {
                    cardsPlayedToUpdate.splice(cardsPlayedToUpdateIdx, 1)
                    break
                }
                cardsPlayedToUpdateIdx++
            }

            setCardsPlayed(cardsPlayedToUpdate);
        })

        socket && socket.on('historyUpdate', (cardPlayed, action, player) => {
            setHistory([...history, { cardPlayed, action, player }])
        })

        return () => {
            socket && socket.off('cardPlayed')
            socket && socket.off('cardWithdrawn')
            socket && socket.off('historyUpdate')
        };
    }, [socket, cardsPlayed, history])

    return (
        <SocketContext.Provider value={socket}>
            <div className={classes.upperSection}>
                <div>
                    <Card className={classes.playersBox}>
                        <CardContent>
                            <Typography>遊戲參加者:</Typography>
                            <Typography>{players.map((player) => (
                                <div>
                                    {player}<br />
                                </div>
                            ))}</Typography>
                        </CardContent>
                    </Card>
                    <Button
                        className={classes.startGameButton}
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenGameConfigModal(true)}
                        disabled={cards.length > 0 || !enteredName}
                    >
                        玩呀玩呀玩呀
                    </Button>
                </div>

                {!enteredName &&
                    <div className={classes.enterNameBox}>
                        <EnterName setEnteredName={setEnteredName} />
                    </div>
                }
                {deck.length > 0 &&
                    <div className={classes.cardsPile}>
                        <Typography>抽咭</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => socket.emit(
                                'drawCard',
                                socket.id
                            )}
                        >
                            抽卡
                        </Button>
                    </div>
                }
                {cardsPlayed.length > 0 &&
                    <div className={classes.cardsPile}>
                        <Typography>出咭</Typography>
                        <PlayingCard
                            color={cardsPlayed[cardsPlayed.length - 1].color}
                            suit={cardsPlayed[cardsPlayed.length - 1].suit}
                            value={cardsPlayed[cardsPlayed.length - 1].value}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => socket.emit(
                                'withdrawCard',
                                socket.id,
                                cardsPlayed[cardsPlayed.length - 1]
                            )}
                        >
                            取咭
                        </Button>
                    </div>
                }

                <History history={history} />

                <GameConfigModal
                    open={openGameConfigModal}
                    setOpenGameConfigModal={setOpenGameConfigModal}
                    players={players}
                />
            </div>
            <div>
                {cards.length > 0 && (
                    <List className={classes.cards}>
                        {cards.map((card, index) => (
                            <ListItem className={classes.card} key={index}>
                                <PlayingCard
                                    color={card.color}
                                    suit={card.suit}
                                    value={card.value}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        socket.emit('playCard', socket.id, index)
                                    }}
                                >
                                    出卡
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
        </SocketContext.Provider>
    );
}

export default App;
