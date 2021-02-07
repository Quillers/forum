DROP SCHEMA IF EXISTS forum CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA forum;
ALTER SCHEMA forum OWNER TO "forum";
COMMENT ON SCHEMA forum IS 'La base du forum des quillers';

SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE forum.users (
    id integer NOT NULL,
    pseudo character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255),
    status character varying(50)
);
ALTER TABLE forum.users OWNER TO "forum";
COMMENT ON TABLE forum.users IS 'Contient les infos utilisateurs du forum.';

CREATE SEQUENCE forum.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE forum.users_id_seq OWNER TO "forum";
ALTER SEQUENCE forum.users_id_seq OWNED BY forum.users.id;

CREATE TABLE forum.category (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);
ALTER TABLE forum.category OWNER TO "forum";

CREATE SEQUENCE forum.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE forum.category_id_seq OWNER TO "forum";
ALTER SEQUENCE forum.category_id_seq OWNED BY forum.category.id;

CREATE TABLE forum.message (
    id integer NOT NULL,
    author character varying(128) NOT NULL,
    message_content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    modified_at timestamp without time zone,
    topic_id integer
);
ALTER TABLE forum.message OWNER TO "forum";

CREATE SEQUENCE forum.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE forum.message_id_seq OWNER TO "forum";
ALTER SEQUENCE forum.message_id_seq OWNED BY forum.message.id;

CREATE TABLE forum.topic (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    topic_description text NOT NULL,
    author character varying(128) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    modified_at timestamp without time zone,
    category_id integer
);
ALTER TABLE forum.topic OWNER TO "forum";

CREATE SEQUENCE forum.topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE forum.topic_id_seq OWNER TO "forum";
ALTER SEQUENCE forum.topic_id_seq OWNED BY forum.topic.id;

ALTER TABLE ONLY forum.users ALTER COLUMN id SET DEFAULT nextval('forum.users_id_seq'::regclass);

ALTER TABLE ONLY forum.category ALTER COLUMN id SET DEFAULT nextval('forum.category_id_seq'::regclass);

ALTER TABLE ONLY forum.message ALTER COLUMN id SET DEFAULT nextval('forum.message_id_seq'::regclass);

ALTER TABLE ONLY forum.topic ALTER COLUMN id SET DEFAULT nextval('forum.topic_id_seq'::regclass);

INSERT INTO forum.users (pseudo, password, email, status) VALUES
('Julien',  'Bob', 'jupellin39@gmail.com',   'dev'),
('Alice',	'quiller',	'',  'dev'),
('Valentin',    'quiller',	'',  'dev'),
('Camille', 'quiller', '' ,'dev'),
('Flo', 'quiller',	'' , 'dev');

INSERT INTO forum.category ("name") VALUES
("animal"),
("arts"),
("bdsm"),
("cinema"),
("sports"),
("technology"),
("videogames"),



INSERT INTO forum.message (author, message_content, created_at, modified_at, topic_id) VALUES
('Un auteur' ,  'un contenu de message',   DEFAULT, DEFAULT,	1),
('Un 2eme auteur' ,  'un 2ème contenu de message',   DEFAULT, DEFAULT,	2),
('Un 3ème auteur' ,  'un 3ème contenu de message',   DEFAULT, DEFAULT,	3),
('Un 4ème auteur' ,  'un 4ème contenu de message',   DEFAULT, DEFAULT,	1),
('Un 5ème auteur' ,  'un 5ème contenu de message',   DEFAULT, DEFAULT,	1);


COPY forum.topic (id, title, topic_description, author, created_at, modified_at, category_id) FROM stdin;
1	premier topic humanitaire	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	1
2	premier topic hardware	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	2
3	premier minous	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	3
\.

SELECT pg_catalog.setval('forum.users_id_seq', 5, true);
SELECT pg_catalog.setval('forum.category_id_seq', 3, true);
SELECT pg_catalog.setval('forum.message_id_seq', 1, false);
SELECT pg_catalog.setval('forum.topic_id_seq', 3, true);

ALTER TABLE ONLY forum.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY forum.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);

ALTER TABLE ONLY forum.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);

ALTER TABLE ONLY forum.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);

ALTER TABLE ONLY forum.message
    ADD CONSTRAINT message_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES forum.topic(id);

ALTER TABLE ONLY forum.topic
    ADD CONSTRAINT topic_category_id_fkey FOREIGN KEY (category_id) REFERENCES forum.category(id);
