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

# Gestion des branches

INFO GIT : Après de multiples tâtonnements, il semble que le mieux pour gérer le travaille d'équipe sur git / github est :

- Pour débuter, avec git clone => git clone de la branche 'main', donc récup l'adresse de cette branche dans le dépôt, c'est la branche par défaut donc ça va...
- Pour travailler en local => Créer une branche locale pour travailler dessus : "git checkout -b ma_branche_locale",
-  Pour sauvegarder le travail local => "git add ." puis "git commit -m "blabla..."", pas de push !


- En fin de 'journée', il faut remettre à jour la branche main du serveur :
  
  - On sauve le travail de la journée : git add . - git commit -m ""
  - On bascule sur la branche main : git checkout main
  - On merge la branche d'ou on vient : git merge la_branche_ou_gt
  - On push sur la branche main du serveur après avoir réglé d'éventuels conflits de fusion : git push
  
  et voilà !