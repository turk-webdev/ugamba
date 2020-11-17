const Read = require('../classes/dbRead');
const Create = require('../classes/dbCreate');

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
        for (let i=1; i<=MAX_CARD_ID; i++) {
            var cols = ['id_card', 'id_deck'];
            var values = [i, data.id];
            Create.insert('deck_card',cols,values);
        }
    })
    .catch((error) => {
        // TODO: Actual error handling
        return res.send(error);
    })
};