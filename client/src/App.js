import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import socketIOClient from 'socket.io-client';

import { PlayingCard } from './components/playingCard'
import { Color, Suit, Value } from './components/playingCard/constants.js'

const useStyles = makeStyles({
    cards: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '800px',
        width: '100%'
    }
})

function App() {
  const classes = useStyles();

  useEffect(() => {
    const socket = socketIOClient(
      'http://127.0.0.1:4001',
      { transports: ['websocket', 'polling', 'flashsocket'] }
    );
  }, []);

  return (
    <div className={classes.cards}>
      <PlayingCard
        color={Color.BLACK}
        suit={Suit.HEARTS}
        value={Value.JACK}
      />
      <PlayingCard
        color={Color.RED}
        suit={Suit.SPADES}
        value={Value.QUEEN}
      />
      <PlayingCard
        color={Color.RED}
        suit={Suit.CLUBS}
        value={Value.THREE}
      />
      <PlayingCard
        color={Color.BLACK}
        suit={Suit.DIAMONDS}
        value={Value.ACE}
      />
    </div>
  );
}

export default App;
