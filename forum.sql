--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

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

CREATE SCHEMA module_connexion;
ALTER SCHEMA module_connexion OWNER TO "forum";
COMMENT ON SCHEMA module_connexion IS 'Développement du module ''connexion'', contient les infos des utilisateurs enregistrés sur le forum.';

CREATE SCHEMA module_forum;
ALTER SCHEMA module_forum OWNER TO "forum";
SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE module_connexion.users (
    id integer NOT NULL,
    pseudo character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(255)
);
ALTER TABLE module_connexion.users OWNER TO "forum";
COMMENT ON TABLE module_connexion.users IS 'Contient les infos utilisateurs du forum.';

CREATE SEQUENCE module_connexion.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE module_connexion.users_id_seq OWNER TO "forum";
ALTER SEQUENCE module_connexion.users_id_seq OWNED BY module_connexion.users.id;

CREATE TABLE module_forum.category (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);
ALTER TABLE module_forum.category OWNER TO "forum";

CREATE SEQUENCE module_forum.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE module_forum.category_id_seq OWNER TO "forum";
ALTER SEQUENCE module_forum.category_id_seq OWNED BY module_forum.category.id;

CREATE TABLE module_forum.message (
    id integer NOT NULL,
    author character varying(128) NOT NULL,
    message_content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    modified_at timestamp without time zone,
    topic_id integer
);
ALTER TABLE module_forum.message OWNER TO "forum";

CREATE SEQUENCE module_forum.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE module_forum.message_id_seq OWNER TO "forum";
ALTER SEQUENCE module_forum.message_id_seq OWNED BY module_forum.message.id;

CREATE TABLE module_forum.topic (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    topic_description text NOT NULL,
    author character varying(128) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    modified_at timestamp without time zone,
    category_id integer
);
ALTER TABLE module_forum.topic OWNER TO "forum";

CREATE SEQUENCE module_forum.topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE module_forum.topic_id_seq OWNER TO "forum";
ALTER SEQUENCE module_forum.topic_id_seq OWNED BY module_forum.topic.id;

ALTER TABLE ONLY module_connexion.users ALTER COLUMN id SET DEFAULT nextval('module_connexion.users_id_seq'::regclass);

ALTER TABLE ONLY module_forum.category ALTER COLUMN id SET DEFAULT nextval('module_forum.category_id_seq'::regclass);

ALTER TABLE ONLY module_forum.message ALTER COLUMN id SET DEFAULT nextval('module_forum.message_id_seq'::regclass);

ALTER TABLE ONLY module_forum.topic ALTER COLUMN id SET DEFAULT nextval('module_forum.topic_id_seq'::regclass);

COPY module_connexion.users (id, pseudo, password, email) FROM stdin;
1	forum	Bob	jupellin39@gmail.com
2	Alice	quiller	\N
3	Valentin	quiller	\N
4	Camille	quiller	\N
5	Flo	quiller	\N
\.

COPY module_forum.category (id, name) FROM stdin;
1	Humanitaire
2	Materiel Informatique
3	Videos de chats mignons
\.

COPY module_forum.message (id, author, message_content, created_at, modified_at, topic_id) FROM stdin;
\.

COPY module_forum.topic (id, title, topic_description, author, created_at, modified_at, category_id) FROM stdin;
1	premier topic humanitaire	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	1
2	premier topic hardware	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	2
3	premier minous	blablablabla topic humanitaire	valentin	2021-01-31 00:00:00	\N	3
\.

SELECT pg_catalog.setval('module_connexion.users_id_seq', 5, true);
SELECT pg_catalog.setval('module_forum.category_id_seq', 3, true);
SELECT pg_catalog.setval('module_forum.message_id_seq', 1, false);
SELECT pg_catalog.setval('module_forum.topic_id_seq', 3, true);
ALTER TABLE ONLY module_connexion.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY module_forum.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);

ALTER TABLE ONLY module_forum.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);

ALTER TABLE ONLY module_forum.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);

ALTER TABLE ONLY module_forum.message
    ADD CONSTRAINT message_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES module_forum.topic(id);

ALTER TABLE ONLY module_forum.topic
    ADD CONSTRAINT topic_category_id_fkey FOREIGN KEY (category_id) REFERENCES module_forum.category(id);
