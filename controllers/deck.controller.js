const Read = require('../classes/dbRead');

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
        return res.send(error);
    });
};