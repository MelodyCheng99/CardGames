import { Card, CardContent, Typography } from '@material-ui/core';
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
    cards: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '800px',
        width: '100%'
    }
})

export const SocketContext = React.createContext();

function App() {
  const classes = useStyles();
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    setSocket(socketIOClient(
      'http://127.0.0.1:4001',
      { transports: ['websocket', 'polling', 'flashsocket'] }
    ));
  }, []);

  return (
    <SocketContext.Provider value={socket}>
        <div>
            <Card className={classes.playersBox}>
                <CardContent>
                    <Typography>玩家們:</Typography>
                </CardContent>
            </Card>
            <div className={classes.enterNameBox}>
                <EnterName />
            </div>
        </div>
    </SocketContext.Provider>

//    <div className={classes.cards}>
//      <PlayingCard
//        color={Color.BLACK}
//        suit={Suit.HEARTS}
//        value={Value.JACK}
//      />
//      <PlayingCard
//        color={Color.RED}
//        suit={Suit.SPADES}
//        value={Value.QUEEN}
//      />
//      <PlayingCard
//        color={Color.RED}
//        suit={Suit.CLUBS}
//        value={Value.THREE}
//      />
//      <PlayingCard
//        color={Color.BLACK}
//        suit={Suit.DIAMONDS}
//        value={Value.ACE}
//      />
//    </div>
  );
}

export default App;
