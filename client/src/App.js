import { Card, CardContent, Typography, Button, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import socketIOClient from 'socket.io-client';

import { EnterName } from './components/enterName'
import { PlayingCard } from './components/playingCard'
import { Color, Suit, Value } from './components/playingCard/constants.js'

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
        width: 150,
        height: 200
    },
    startGameButton: {
        marginLeft: 10,
        marginTop: 10
    },
    cards: {
        display: 'flex',
        alignItems: 'flex-end',
        height: '550px',
        maxWidth: '1650px',
        overflow: 'auto'
    },
    card: {
        display: 'flex',
        flexDirection: 'column'
    },
    playedCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        width: '100%'
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

    socket && socket.on('cardsDealt', (dealtCards) => {
      setCards(dealtCards);
    })

    socket && socket.on('cardPlayed', (cardPlayed) => {
      setCardsPlayed(cardsPlayed => [...cardsPlayed, cardPlayed]);
    })
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
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
                onClick={() => socket.emit('startGame')}
            >
                玩呀玩呀玩呀
            </Button>
            { !enteredName &&
                <div className={classes.enterNameBox}>
                    <EnterName setEnteredName={setEnteredName} />
                </div>
            }

            { cardsPlayed.length > 0 &&
                <div className={classes.playedCard}>
                    <PlayingCard
                        color={cardsPlayed[cardsPlayed.length - 1].color}
                        suit={cardsPlayed[cardsPlayed.length - 1].suit}
                        value={cardsPlayed[cardsPlayed.length - 1].value}
                    />
                </div>
            }

            { cards.length > 0 && (
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
                                onClick={() => socket.emit('playCard', socket.id, index)}
                            >
                                遊戲卡
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
