DROP SCHEMA IF EXISTS forum CASCADE;


CREATE SCHEMA forum;
ALTER SCHEMA forum OWNER TO "quiltuuc_ju";
COMMENT ON SCHEMA forum IS 'La base du forum des quillers';


CREATE TABLE forum.users (
    id SERIAL PRIMARY KEY,
    pseudo character varying(50) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255),
    status character varying(50)
);
ALTER TABLE forum.users OWNER TO "quiltuuc_ju";
COMMENT ON TABLE forum.users IS 'Contient les infos utilisateurs du forum.';


CREATE TABLE forum.category (
    id SERIAL PRIMARY KEY,
    name character varying(128) NOT NULL
);
ALTER TABLE forum.category OWNER TO "quiltuuc_ju";


CREATE TABLE forum.message (
    id SERIAL PRIMARY KEY,
    author character varying(128) NOT NULL,
    message_content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    modified_at timestamp without time zone,
    topic_id integer
);
ALTER TABLE forum.message OWNER TO "quiltuuc_ju";

CREATE TABLE forum.topic (
    id SERIAL PRIMARY KEY,
    title character varying(128) NOT NULL,
    topic_description text NOT NULL,
    author character varying(128) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE,
    modified_at timestamp without time zone,
    category_id integer
);
ALTER TABLE forum.topic OWNER TO "quiltuuc_ju";


INSERT INTO forum.users (pseudo, firstname, lastname, password, email, status) VALUES
('J-P', 'Julien', 'Pellin', '$2b$10$EUaudgeyxHm8Tl0PwEQxi.fGH.8BXR8J3aLyMCZfsDqoIqsdWAeby', 'jupellin39@gmail.com',   'dev');

INSERT INTO forum.category ("name") VALUES
('animals'),
('arts'),
('bdsm'),
('cinema'),
('sports'),
('technology'),
('videogames');



INSERT INTO forum.message (author, message_content, created_at, modified_at, topic_id) VALUES
('Un auteur' ,  'un contenu de message',   DEFAULT, DEFAULT,	1),
('Un 2eme auteur' ,  'un 2ème contenu de message',   DEFAULT, DEFAULT,	2),
('Un 3ème auteur' ,  'un 3ème contenu de message',   DEFAULT, DEFAULT,	3),
('Un 4ème auteur' ,  'un 4ème contenu de message',   DEFAULT, DEFAULT,	1),
('Un 5ème auteur' ,  'un 5ème contenu de message',   DEFAULT, DEFAULT,	1);


INSERT INTO forum.topic (title, topic_description, author, created_at, modified_at, category_id) VALUES
('premier topic humanitaire',	'blablablabla topic humanitaire',	'valentin',	'2021-01-31 00:00:00', NULL,	1),
('premier topic hardware',	'blablablabla topic hardware',	'valentin',	'2021-01-31 00:00:00', NULL,	2),
('premier topic minous',	'blablablabla topic minous',	'valentin',	'2021-01-31 00:00:00', NULL,	3);


ALTER TABLE ONLY forum.message
    ADD CONSTRAINT message_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES forum.topic(id);

ALTER TABLE ONLY forum.topic
    ADD CONSTRAINT topic_category_id_fkey FOREIGN KEY (category_id) REFERENCES forum.category(id);
