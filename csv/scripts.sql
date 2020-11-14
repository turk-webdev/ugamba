COPY card_value(id, value)
FROM '/Users/turkerdin/Downloads/values.csv'
DELIMITER ','
CSV HEADER;

COPY card_suit(id, suit)
FROM '/Users/turkerdin/Downloads/suits.csv'
DELIMITER ','
CSV HEADER;

COPY card(id, id_suit, id_value)
FROM '/Users/turkerdin/Downloads/cards.csv'
DELIMITER ','
CSV HEADER;