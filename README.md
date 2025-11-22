# Galerie d'Inspiration Créative

Une application web interactive pour rechercher des images via l'API Unsplash et gérer une liste de favoris.

## Fonctionnalités

- Recherche d'images via l'API Unsplash
- Affichage en grille responsive
- Gestion des favoris (LocalStorage)
- Interface moderne et soignée

## Installation

1. Cloner le dépôt.
2. Créer un fichier `config.js` à la racine (voir `config.example.js` si disponible, sinon utiliser la structure ci-dessous) :
   ```javascript
   const config = {
       API_KEY: 'VOTRE_CLE_API'
   };
   ```

## Démarrage

⚠️ **Important** : Ce projet utilise des modules ES6 (`import`/`export`), ce qui nécessite un serveur HTTP local. Ouvrir directement `index.html` dans le navigateur ne fonctionnera pas à cause des restrictions CORS.

### Option 1 : Utiliser le script batch (Recommandé pour Windows)
Double-cliquez sur `demarrer-serveur.bat`. Le serveur démarrera automatiquement et ouvrira votre navigateur sur `http://localhost:8000/index.html`.

### Option 2 : Utiliser PowerShell directement
Ouvrez PowerShell dans le dossier du projet et exécutez :
```powershell
powershell.exe -ExecutionPolicy Bypass -File server.ps1
```

### Option 3 : Utiliser Live Server (VS Code - Recommandé)
Si vous utilisez VS Code :
1. Installez l'extension **"Live Server"** (par Ritwick Dey)
2. Clic droit sur `index.html` → **"Open with Live Server"**
   OU
   Cliquez sur le bouton **"Go Live"** dans la barre d'état en bas de VS Code

### Option 4 : Utiliser npx serve (Node.js)
Si vous avez Node.js installé :
```bash
npx serve .
```
Puis ouvrez l'URL affichée dans votre navigateur.

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, Variables)
- JavaScript (ES6+, Fetch API, LocalStorage)

## Auteur - Date
AbigaelNgeleka - 22/11/2025