CREATE TABLE shows(id varchar, movie_id varchar, time_at datetime, chairs int, room varchar);
CREATE TABLE movie(id varchar, title varchar, duration int);
CREATE TABLE tickets(id varchar, show_id varchar, chair int, status varchar DEFAULT 'AVAILABLE');
CREATE TABLE booked_tickets(ticket_id varchar, booked_at datetime);

INSERT INTO movie VALUES
('69152ce0-b708-11ea-b3de-0242ac130004', 'Avengers I', 144),
('69152ef2-b708-11ea-b3de-0242ac130004', 'Avengers II', 142),
('69152fec-b708-11ea-b3de-0242ac130004', 'Avengers III', 160),
('691530d2-b708-11ea-b3de-0242ac130004', 'Avengers IV', 182);

-- create new show with specific movie and time. 
-- we have movie_id and datetime
-- TODO: do we need to check if room available?
INSERT INTO shows VALUES('a169bf20-060d-449e-9c7b-006fa872fc89', '69152ef2-b708-11ea-b3de-0242ac130004', '2019-08-09 17:24:08', 945, 'IMAX');
INSERT INTO shows VALUES('16d0d668-b709-11ea-b3de-0242ac130004', '69152ef2-b708-11ea-b3de-0242ac130004', '2019-08-09 20:24:08', 945, 'IMAX');
INSERT INTO shows VALUES('1cbbebda-b709-11ea-b3de-0242ac130004', '69152ef2-b708-11ea-b3de-0242ac130004', '2019-08-09 12:00:00', 945, 'Zal 1');
INSERT INTO shows VALUES('22db6464-b709-11ea-b3de-0242ac130004', '69152ef2-b708-11ea-b3de-0242ac130004', '2019-08-09 17:00:00', 945, 'Zal 2');
-- create ticket for new show
INSERT INTO tickets (id, show_id, chair)VALUES('58890ab2-b709-11ea-b3de-0242ac130004', 'a169bf20-060d-449e-9c7b-006fa872fc89', 1);
INSERT INTO tickets (id, show_id, chair)VALUES('5bf2c238-b709-11ea-b3de-0242ac130004', 'a169bf20-060d-449e-9c7b-006fa872fc89', 2);
INSERT INTO booked_tickets VALUES('5bf2c238-b709-11ea-b3de-0242ac130004', date('now'));
UPDATE tickets SET status = 'BOOKED' WHERE id  = '5bf2c238-b709-11ea-b3de-0242ac130004';
SELECT * FROM tickets t WHERE t.show_id = 'a169bf20-060d-449e-9c7b-006fa872fc89' AND t.status not in ('BOOKED', 'SOLD');

-- unbook ticket by one minute timer
BEGIN TRANSACTION;
UPDATE tickets SET status = 'AVAILABLE' WHERE id IN(
    SELECT b.ticket_id FROM booked_tickets b WHERE date('now') - b.booked_at > 15
);
DELETE FROM booked_tickets WHERE date('now') - booked_at > 15;
COMMIT;

SELECT * FROM tickets t WHERE t.show_id = 'a169bf20-060d-449e-9c7b-006fa872fc89' AND t.status not in ('BOOKED', 'SOLD');
-- list shows by movie:: moview_id 
SELECT * FROM shows s WHERE s.movie_id = '69152ef2-b708-11ea-b3de-0242ac130004' AND s.time_at > date('now');

-- order ticket for show:: show_id
-- list all available tickets
SELECT * FROM tickets t WHERE t.show_id = 'a169bf20-060d-449e-9c7b-006fa872fc89' AND t.status not in ('BOOKED', 'SOLD');
-- book a ticket
BEGIN TRANSACTION;
UPDATE tickets SET status = 'BOOKED' WHERE id = '58890ab2-b709-11ea-b3de-0242ac130004';
INSERT INTO booked_tickets VALUES('58890ab2-b709-11ea-b3de-0242ac130004', date('now'));
COMMIT;

-- sell ticket when paid
BEGIN TRANSACTION;
UPDATE tickets SET status = 'SOLD' WHERE id = '58890ab2-b709-11ea-b3de-0242ac130004';
DELETE FROM booked_tickets WHERE ticket_id = '58890ab2-b709-11ea-b3de-0242ac130004';
COMMIT;

SELECT * FROM tickets t WHERE t.show_id = 'a169bf20-060d-449e-9c7b-006fa872fc89' AND t.status not in ('BOOKED', 'SOLD');

-- add new moview
-- INSERT INTO movie VALUES({uuid}, {title}, {duration}});

-- add new show
-- INSERT INTO shows VALUES('22db6464-b709-11ea-b3de-0242ac130004', '69152ef2-b708-11ea-b3de-0242ac130004', '2019-08-09 17:00:00', 945, 'Zal 2');