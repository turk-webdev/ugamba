const Read = require('../classes/dbRead');

exports.showAll = (req, res) => {
    console.log(req.params);
    Read.findAll(req.params.table)
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