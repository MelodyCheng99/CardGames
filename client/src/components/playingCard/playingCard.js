import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Favorite } from '@material-ui/icons'

import React from 'react'

import { Color, Suit, Value } from './constants.js'

const useStyles = makeStyles({
    card: {
        width: 175,
        height: 250,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    bottomValue: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: 40,
        fontSize: 30
    },
    topValue: {
        fontSize: 30
    },
    redTopValue: {
        color: 'red',
        fontSize: 30
    },
    redBottomValue: {
        color: 'red',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: 40,
        fontSize: 30
    },
    redSuit: {
        color: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 140,
        fontSize: 100
    },
    suit: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 140,
        fontSize: 100
    }
})

function PlayingCard({
    color,
    suit,
    value
}) {
    const classes = useStyles();

    return (
        <Card className={classes.card} variant="outlined">
            <CardContent>
                <Typography className={color === Color.RED ? classes.redTopValue : classes.topValue}>
                    {value}
                </Typography>
                {suit === Suit.HEARTS && <Typography className={color === Color.RED ? classes.redSuit : classes.suit}>
                    &hearts;
                </Typography>}
                {suit === Suit.CLUBS && <Typography className={color === Color.RED ? classes.redSuit : classes.suit}>
                    &clubs;
                </Typography>}
                {suit === Suit.SPADES && <Typography className={color === Color.RED ? classes.redSuit : classes.suit}>
                    &spades;
                </Typography>}
                {suit === Suit.DIAMONDS && <Typography className={color === Color.RED ? classes.redSuit : classes.suit}>
                    &diams;
                </Typography>}
                <Typography className={color === Color.RED ? classes.redBottomValue : classes.bottomValue}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default PlayingCard