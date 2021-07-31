# groupomania-backend

Procédure à suivre pour démarrer l'application.


----------------------------------------------------------------------
PARTIE 1 - La base de donnée MySQL :
----------------------------------------------------------------------

Etape 1 : Créer la base de donnée "groupomania" dans MySQL avec la commande "CREATE DATABASE groupomania;"

Pour ajouter les droits administrateur à un compte utilisateur existant :
Dans votre base de donnée MySql executer la commande suivante : UPDATE Users SET is_admin = 1 WHERE id = [id_utilisateur];


----------------------------------------------------------------------
PARTIE 2 - Démarrer le server Backend (groupomania-backend-main) :
----------------------------------------------------------------------

Etape 1 : Placer le dossier "config" à la racine du dossier "groupomania-backend-main". 
Ce dossier contient les variables d'environnements de l'application ainsi que le fichier config.json. Ce fichier permet de s'authentifier au server MySQL et à la base de donnée.

Etape 2 : Si besoin vous pouvez adapter les champs ci dessous du fichier "config.json" par rapport à votre server MySQL, sinon passer directement à l'étape 3 :
    "username": "root",
    "password": "password",
    "database": "groupomania",
    "host": "127.0.0.1",

Etape 3 : Se rendre dans le dossier groupomania-backend-main puis installer les dépendances en executant la commande "npm install"

Etape 4 : Démarrer le server en executant la commande "nodemon server" (installer nodemon avec la commande "npm install -g nodemon" au préalable si nécessaire)

Si tout s'est bien déroulé, les tables de la base de données se sont générées automatiquement et le serveur doit démarrer.


----------------------------------------------------------------------
Vous pouvez désormais utiliser l'application groupomania :)

URL du repository frontend de l'application : https://github.com/Mathias-Hadji/groupomania-frontend
----------------------------------------------------------------------





