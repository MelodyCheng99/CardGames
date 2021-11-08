import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Suit } from '../playingCard/constants'

const useStyles = makeStyles({
    historyBox: {
        marginRight: 10,
        minWidth: 400,
        width: 400,
        minHeight: 400,
        height: '100%'
    }
})

const getTextGivenSuit = (suit) => {
    if (suit === Suit.HEARTS) {
        return <span>&hearts;</span>
    } else if (suit === Suit.CLUBS) {
        return <span>&clubs;</span>
    } else if (suit === Suit.DIAMONDS) {
        return <span>&diams;</span>
    } else {
        return <span>&spades;</span>
    }
}

const History = ({ history }) => {
    const classes = useStyles();

    return (
        <Card className={classes.historyBox}>
            <CardContent>
                <Typography>活動:</Typography>
                <Typography>{history?.map((event) => {
                    let prettifiedEvent = ''

                    if (event.player) {
                        prettifiedEvent = event.player
                    } else {
                        prettifiedEvent = '你'
                    }

                    if (event.action === "play") {
                        prettifiedEvent += '出了'
                    } else if (event.action === "withdraw") {
                        prettifiedEvent += '抽了'
                    } else {
                        prettifiedEvent += '抽到了'
                    }

                    return (
                        <div key={`${event.cardPlayed.suit}-${event.cardPlayed.value}-${event.cardPlayed.color}`}>
                            {prettifiedEvent}
                            {event.action === "draw" && '牌'}
                            {event.action !== "draw" && getTextGivenSuit(event.cardPlayed.suit)}
                            {event.action !== "draw" && event.cardPlayed.value}
                            <br />
                        </div>
                    )
                })}</Typography>
            </CardContent>
        </Card>
    )
}

export default History
