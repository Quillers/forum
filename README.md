# forum
forum

## Setup base de donnée
Avoir postgres d'installer

### Depuis un terminal :

sudo -i -u postgres // On bascule sur l'utilisateur postgres

pgsql // On lance pgsql en tant que postgres, donc superutilisateur

CREATE USER forum WITH ENCRYPTED LOGIN "mot_de_passe";

CREATE DATABASE forum OWNER forum;

Ctrl + d, 2 fois pour revenir au terminal utilisateur "habituel"

pgsql -h localhost -U forum -f forumExport.sql

// Ici on se connecte à la base forum et on lance les commandes contenues dans le fichier, c'est à dire suppression des tables éventuellement existantes dans la base et création de celles prévues par le fichier.

// Les commandes habituelles sont maintenant possible, il faut tester !
