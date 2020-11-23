const Read = require('../classes/dbRead');

exports.showAll = (req, res) => {
  console.log(req.params);
  Read.findAll(req.params.table)
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: 'No cards found' });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
};

exports.getOneExact = (req, res) => {
  Read.findOneBySingleQueryExact(
    req.params.table,
    req.params.col,
    req.params.query,
  )
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: 'No cards found' });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
};

exports.getAnyExact = (req, res) => {
  Read.findAllBySingleQueryExact(
    req.params.table,
    req.params.col,
    req.params.query,
  )
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: 'No cards found' });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
};

exports.getOneLike = (req, res) => {
  Read.findOneBySingleQueryLike(
    req.params.table,
    req.params.col,
    req.params.query,
  )
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: 'No cards found' });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
};

exports.getAnyLike = (req, res) => {
  Read.findAllBySingleQueryLike(
    req.params.table,
    req.params.col,
    req.params.query,
  )
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: 'No cards found' });
      }
      return res.send(data);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
};
