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
let socketIdToName = {};
let deck = [];

io.on('connection', (socket) => {
    console.log('New client connected!');
    players.push(socket.id);
    playersCards[socket.id] = [];

    // TODO: Place in a different file
    socket.on('enterName', (socketId, name) => {
        console.log(name, 'joined the game!');
        socketIdToName[socketId] = name;
        io.emit('playerEntered', name);
    });

    socket.on('startGame', (numCards) => {
        if (players.length > 1) {
            let cardsToDeal = cards.slice();
            const totalNumPlayers = players.length;
            let currentPlayer = 0;
            let numCard = 0;

            // Deal cards to player
            while (numCard < numCards) {
                const cardIndex = Math.floor(Math.random() * (cardsToDeal.length - 1));

                let currentPlayersCards = playersCards[players[currentPlayer]];
                currentPlayersCards.push(cardsToDeal[cardIndex]);
                playersCards[players[currentPlayer]] = currentPlayersCards;

                cardsToDeal.splice(cardIndex, 1);

                if (currentPlayer == totalNumPlayers - 1) {
                    currentPlayer = 0;
                    numCard++;
                } else {
                    currentPlayer++;
                }
            }

            // Shuffle remaining cards
            while (cardsToDeal.length > 0) {
                const cardIndex = Math.floor(Math.random() * (cardsToDeal.length - 1));
                deck.push(cardsToDeal[cardIndex]);
                
                cardsToDeal.splice(cardIndex, 1);
            }

            players.forEach((player) => {
                io.to(player).emit(
                    'cardsDealt',
                    playersCards[player],
                    deck
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

        // Emit for history
        io.to(player).emit(
            'historyUpdate',
            cardPlayed,
            'play',
            undefined
        )
        socket.broadcast.emit(
            'historyUpdate',
            cardPlayed,
            'play',
            socketIdToName[player]
        )
    })

    socket.on('withdrawCard', (player, card) => {
        let playerCards = playersCards[player];
        playerCards.push(card);

        io.to(player).emit(
            'cardsDealt',
            playerCards
        );

        io.emit('cardWithdrawn', card);

        // Emit for history
        io.to(player).emit(
            'historyUpdate',
            card,
            'withdraw',
            undefined
        )
        socket.broadcast.emit(
            'historyUpdate',
            card,
            'withdraw',
            socketIdToName[player]
        )
    })

    socket.on('drawCard', (player) => {
        let playerCards = playersCards[player];
        const card = deck.pop();
        playerCards.push(card);

        io.to(player).emit(
            'cardsDealt',
            playerCards,
            deck
        );
        io.emit('cardWithdrawn', card);

        // Emit for history
        io.to(player).emit(
            'historyUpdate',
            card,
            'draw',
            undefined
        )
        socket.broadcast.emit(
            'historyUpdate',
            card,
            'draw',
            socketIdToName[player]
        )
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