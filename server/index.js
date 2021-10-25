const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const index = require('./routes/index');
const cards = require('./cards')

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIO(server);

let players = [];
let playersCards = {};

io.on('connection', (socket) => {
    console.log('New client connected!');
    players.push(socket.id);
    playersCards[socket.id] = [];

    // TODO: Place in a different file
    socket.on('enterName', (name) => {
        console.log(name, 'joined the game!');
        io.emit('playerEntered', name);
    });

    socket.on('startGame', () => {
        if (players.length > 1) {
            let cardsToDeal = cards.slice();
            const totalNumPlayers = players.length;
            let currentPlayer = 0;

            while (cardsToDeal.length > 0) {
                const cardIndex = Math.floor(Math.random() * (cardsToDeal.length - 1));

                let currentPlayersCards = playersCards[players[currentPlayer]];
                currentPlayersCards.push(cardsToDeal[cardIndex]);
                playersCards[players[currentPlayer]] = currentPlayersCards;

                cardsToDeal.splice(cardIndex, 1);

                if (currentPlayer == totalNumPlayers - 1) {
                    currentPlayer = 0;
                } else {
                    currentPlayer++;
                }
            }

            players.forEach((player) => {
                io.to(player).emit(
                    'cardsDealt',
                    playersCards[player]
                );
            });
        }
    })

    socket.on('playCard', (player, cardIndex) => {
        let playerCards = playersCards[player];
        const cardPlayed = playerCards[cardIndex];
        playerCards.splice(cardIndex, 1);
        playersCards[player] = playerCards;

        io.to(player).emit(
            'cardsDealt',
            playerCards
        );

        io.emit('cardPlayed', cardPlayed);
    })

    socket.on('withdrawCard', (player, card) => {
        let playerCards = playersCards[player];
        playerCards.push(card);

        io.to(player).emit(
            'cardsDealt',
            playerCards
        );

        io.emit('cardWithdrawn', card);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected :(');

        const playersIndex = players.indexOf(socket.id);
        players.splice(playersIndex, 1);
        delete playersCards[socket.id];
    });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log('Listening on port', port));