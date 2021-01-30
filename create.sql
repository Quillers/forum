--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-1.pgdg20.04+1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

-- Started on 2021-01-30 16:31:56 CET

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

--
-- TOC entry 6 (class 2615 OID 16388)
-- Name: module_connexion; Type: SCHEMA; Schema: -; Owner: julien
--

CREATE SCHEMA module_connexion;


ALTER SCHEMA module_connexion OWNER TO julien;

--
-- TOC entry 2977 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA module_connexion; Type: COMMENT; Schema: -; Owner: julien
--

COMMENT ON SCHEMA module_connexion IS 'Développement du module ''connexion'', contient les infos des utilisateurs enregistrés sur le forum.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 16402)
-- Name: users; Type: TABLE; Schema: module_connexion; Owner: julien
--

CREATE TABLE module_connexion.users (
    id integer NOT NULL,
    pseudo character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(255)
);


ALTER TABLE module_connexion.users OWNER TO julien;

--
-- TOC entry 2978 (class 0 OID 0)
-- Dependencies: 204
-- Name: TABLE users; Type: COMMENT; Schema: module_connexion; Owner: julien
--

COMMENT ON TABLE module_connexion.users IS 'Contient les infos utilisateurs du forum.';


--
-- TOC entry 203 (class 1259 OID 16400)
-- Name: users_id_seq; Type: SEQUENCE; Schema: module_connexion; Owner: julien
--

CREATE SEQUENCE module_connexion.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE module_connexion.users_id_seq OWNER TO julien;

--
-- TOC entry 2979 (class 0 OID 0)
-- Dependencies: 203
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: module_connexion; Owner: julien
--

ALTER SEQUENCE module_connexion.users_id_seq OWNED BY module_connexion.users.id;


--
-- TOC entry 2841 (class 2604 OID 16405)
-- Name: users id; Type: DEFAULT; Schema: module_connexion; Owner: julien
--

ALTER TABLE ONLY module_connexion.users ALTER COLUMN id SET DEFAULT nextval('module_connexion.users_id_seq'::regclass);


--
-- TOC entry 2971 (class 0 OID 16402)
-- Dependencies: 204
-- Data for Name: users; Type: TABLE DATA; Schema: module_connexion; Owner: julien
--

COPY module_connexion.users (id, pseudo, password, email) FROM stdin;
1	Julien	Bob	jupellin39@gmail.com
2	Alice	quiller	\N
3	Valentin	quiller	\N
4	Camille	quiller	\N
5	Flo	quiller	\N
\.


--
-- TOC entry 2980 (class 0 OID 0)
-- Dependencies: 203
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: module_connexion; Owner: julien
--

SELECT pg_catalog.setval('module_connexion.users_id_seq', 5, true);


--
-- TOC entry 2843 (class 2606 OID 16407)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: module_connexion; Owner: julien
--

ALTER TABLE ONLY module_connexion.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2021-01-30 16:31:56 CET

--
-- PostgreSQL database dump complete
--

