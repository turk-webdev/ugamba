COPY card(id, suit, suit_display, value, value_display)
FROM '/Users/turkerdin/Downloads/cards.csv'
DELIMITER ','
CSV HEADER;