import { Card, CardContent, Typography, Button } from '@material-ui/core';
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
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '550px',
        width: '100%'
    }
})

export const SocketContext = React.createContext();

function App() {
  const classes = useStyles();
  const [socket, setSocket] = useState(undefined);
  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([]);
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
      console.log(dealtCards);
      setCards(dealtCards);
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
                開始遊戲
            </Button>
            {!enteredName &&
                <div className={classes.enterNameBox}>
                    <EnterName setEnteredName={setEnteredName} />
                </div>
            }

            { cards.length > 0 && (
                <div className={classes.cards}>
                    {console.log(cards)}
                    {cards.map((card, index) => (
                        <PlayingCard
                            key={index}
                            color={card.color}
                            suit={card.suit}
                            value={card.value}
                        />
                    ))}
                </div>
            )}
        </div>
    </SocketContext.Provider>
  );
}

export default App;
