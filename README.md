# forum
forum

## Setup base de donnée
Avoir postgres d'installer

### Depuis un terminal :

sudo -i -u postgres // On bascule sur l'utilisateur postgres

// On lance pgsql en tant que postgres, donc superutilisateur

pgsql 

CREATE USER forum WITH ENCRYPTED LOGIN "mot_de_passe";

CREATE DATABASE forum OWNER forum;

// Ouvrir un autre terminal et s'y connecter en tant que forum
// Ici on se connecte à la base forum et on lance les commandes contenues dans le fichier, c'est à dire suppression des tables éventuellement existantes dans la base et création de celles prévues par le fichier.

pgsql -h localhost -U forum -f createForum.sql

// Normalement le script est prévu pour pouvoir réinstaller les tables si la base 'forum' existe.

## Gestion des branches

INFO GIT : Après de multiples tâtonnements, il semble que le mieux pour gérer le travail d'équipe sur git / github est :

- Pour débuter, avec git clone => git clone de la branche 'main', donc récup l'adresse de cette branche dans le dépôt, c'est la branche par défaut donc ça va...
- Pour travailler en local => Créer une branche locale pour travailler dessus : "git checkout -b ma_branche_locale",
- Pour sauvegarder le travail local => "git add ." puis "git commit -m "blabla..."", **pas de push !**

- En fin de 'journée', il faut remettre à jour la branche main du serveur :
  
  - On sauve le travail en local: git add . / git commit -m "..."
  - On bascule sur la branche main : git checkout main
  - On merge la branche d'ou on vient : git merge la_branche_ou_gt
  - On push sur la branche main du serveur après avoir réglé d'éventuels conflits de fusion : git push
  
  et voilà !