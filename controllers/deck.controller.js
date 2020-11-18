const Read = require('../classes/dbRead');
const Create = require('../classes/dbCreate');
const Update = require('../classes/dbUpdate');

const MAX_CARD_ID = 52;

exports.showAll = (req, res)  => {
    Read.findAll('card')
    .then((data) => {
        // TODO: Actually handle return
        if(!data) {
            return res.status(400).send({ error: 'No card found' });
        }
        return res.send(data);
    });
};

exports.getCard = (req, res) => {
    Read.findOneBySingleQueryExact('card','id',req.params.id)
    .then((data) => {
        // TODO: Actually handle return
        if(!data) {
            return res.status(400).send({ error: 'No card found' });
        }
        return res.send(data);
    })
    .catch((error) => {
        // TODO: Actual error handling
        return res.send(error);
    });
};

exports.initDeck = (req, res) => {
    Create.insertIdOnly('deck','id')
    .then((data) => {
        let deckId = data.id;
        for (let i=1; i<=MAX_CARD_ID; i++) {
            let cols = ['id_card', 'id_deck'];
            let values = [i, deckId];
            Create.insert('deck_card',cols,values);
        }
        return deckId;
    })
    .then((deckId) => {
        Update.updateExact('game',['id_deck'],[deckId])
        .catch((error) => {
            // TODO: Actual error handling
            return res.send(error);
        });
    })
    .catch((error) => {
        // TODO: Actual error handling
        return res.send(error);
    });
};