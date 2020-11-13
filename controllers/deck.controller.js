const Card = require('../classes/card');
const CardSuit = require('../classes/cardSuit');
const CardValue = require('../classes/cardValue');
const Deck = require('../classes/deck');
const DeckCard = require('../classes/deckCard');

exports.showAll = (req, res)  => {
    Card.all()
    .then((data) => {
        if(!data) {
            return res.status(400).send({ error: 'No cards found' });
        }
        return res.send(data);
    })
    .catch((err) => {
        return res.status(400).send({ error: err });
    });
}

exports.showCard = (req, res) => {
    Card.findOneById(req.params.id)
    .then((data) => {
        if(!data) {
            return res.status(400).send({ error: 'No card found' });
        }
        return res.send(data);
    })
    .catch((err) => {
        return res.status(400).send({ error: err });
    });
};

exports.dealCard = () => {

};