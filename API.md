# Documentation API - Scoutify

Cette documentation décrit tous les endpoints de l'API REST de Scoutify, une application de génération de CV sportifs pour joueurs de football.

**URL de base :** `http://localhost:3000/api`

---

## Table des matières

1. [CV / Resumes](#cv--resumes)
2. [Génération de PDF](#génération-de-pdf)
3. [Logos de clubs](#logos-de-clubs)
4. [Logos de divisions](#logos-de-divisions)
5. [Badges](#badges)
6. [Authentification Staff](#authentification-staff)
7. [Types de données](#types-de-données)

---

## CV / Resumes

### Récupérer tous les CV

```
GET /api/resumes
```

**Description :** Récupère la liste de tous les CV avec leurs données complètes (joueur, saisons, formations, essais).

**Réponse (200) :**
```json
[
  {
    "resumeId": 1,
    "cv_color": "#1E5EFF",
    "composition_to_display": "4-3-3",
    "comments": "Notes additionnelles",
    "createdAt": "2024-01-15",
    "updatedAt": "2024-01-16",
    "isTreated": false,
    "playerData": { ... },
    "seasons": [ ... ],
    "formations": [ ... ],
    "essais": [ ... ]
  }
]
```

---

### Créer un nouveau CV

```
POST /api/resumes
```

**Description :** Crée un nouveau CV avec toutes les données du joueur.

**Corps de la requête :**
```json
{
  "cv_color": "#1E5EFF",
  "composition_to_display": "4-3-3",
  "comments": "Notes",
  "playerData": {
    "firstname": "Kylian",
    "lastname": "Mbappé",
    "nationality1": "FR",
    "nationality2": "CM",
    "nationality3": null,
    "internationals": "France",
    "player_image": "url_ou_base64",
    "date_of_birth": "1998-12-20",
    "preferred_foot": "Droit",
    "height": 178,
    "weight": 73,
    "primary_position": "AIG",
    "secondary_position": "AC",
    "vma": 22.5,
    "transfermark_url": "https://...",
    "qualities": "Vitesse,Dribble,Finition",
    "email": "email@example.com",
    "phone": "+33612345678",
    "email_agent": "agent@example.com",
    "phone_agent": "+33698765432"
  },
  "seasons": [
    {
      "duration": "2023-2024",
      "current_season": true,
      "is_split": false,
      "clubSeasons": [
        {
          "name": "Paris Saint-Germain",
          "division": "Ligue 1",
          "category": "Sénior",
          "matchs": 29,
          "goals": 27,
          "assists": 7,
          "average_playing_time": 85
        }
      ]
    }
  ],
  "formations": [
    {
      "duration": "2013-2017",
      "title": "Centre de Formation AS Monaco",
      "details": "Formation complète"
    }
  ],
  "essais": [
    {
      "club": "Real Madrid",
      "year": "2012"
    }
  ]
}
```

**Réponse (201) :**
```json
{
  "message": "Resume created successfully",
  "resumeId": 1
}
```

---

### Récupérer un CV par ID

```
GET /api/resumes/{id}
```

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | number | ID du CV |

**Réponse (200) :**
```json
{
  "resumeId": 1,
  "cv_color": "#1E5EFF",
  "composition_to_display": "4-3-3",
  "comments": "Notes",
  "isTreated": false,
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-16",
  "playerData": { ... },
  "seasons": [ ... ],
  "formations": [ ... ],
  "essais": [ ... ],
  "internationals": [ ... ],
  "links": [ ... ]
}
```

**Réponse (404) :**
```json
{
  "message": "Resume not found"
}
```

---

### Mettre à jour un CV

```
PUT /api/resumes/{id}
```

**Description :** Met à jour toutes les données d'un CV existant.

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | number | ID du CV |

**Corps de la requête :** Même structure que POST, avec en plus :
- `isTreated` (boolean) : Statut de traitement
- `internationals` (array) : Sélections internationales
- `links` (array) : Liens externes (vidéos, réseaux sociaux)

**Réponse (200) :**
```json
{
  "message": "Resume updated successfully",
  "resumeId": "1"
}
```

---

### Basculer le statut de traitement

```
PATCH /api/resumes/{id}
```

**Description :** Bascule le statut `is_treated` d'un CV (traité/non traité).

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | number | ID du CV |

**Réponse (200) :**
```json
{
  "message": "Status updated successfully",
  "isTreated": true
}
```

---

### Supprimer un CV

```
DELETE /api/resumes/{id}
```

**Description :** Supprime un CV et toutes ses données associées (saisons, formations, essais, internationals, liens).

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | number | ID du CV |

**Réponse (200) :**
```json
{
  "message": "Resume deleted successfully"
}
```

---

## Génération de PDF

### Générer un CV en PDF

```
GET /api/generate-cv?id={id}
```

**Description :** Génère un fichier PDF du CV au format A4 en utilisant Puppeteer.

**Paramètres de requête :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID du CV (ou "demo" pour le mode démo) |

**Réponse (200) :**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="CV-{id}.pdf"`

**Réponse (500) :**
```json
{
  "error": "Failed to generate PDF",
  "details": "Message d'erreur"
}
```

---

## Logos de clubs

### Récupérer tous les logos

```
GET /api/logos
```

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "name": "Paris Saint-Germain",
    "initials": "PSG",
    "image": "base64_ou_url"
  }
]
```

---

### Créer un logo

```
POST /api/logos
```

**Corps de la requête :**
```json
{
  "name": "Paris Saint-Germain",
  "initials": "PSG",
  "image": "base64_ou_url"
}
```

**Champs requis :** `name`, `image`

**Réponse (201) :**
```json
{
  "id": 1,
  "message": "Logo créé avec succès"
}
```

---

### Récupérer un logo par ID

```
GET /api/logos/{id}
```

**Réponse (200) :**
```json
{
  "id": 1,
  "name": "Paris Saint-Germain",
  "initials": "PSG",
  "image": "base64_ou_url"
}
```

---

### Modifier un logo

```
PUT /api/logos/{id}
```

**Corps de la requête :**
```json
{
  "name": "Nouveau nom",
  "initials": "NN",
  "image": "nouvelle_image"
}
```

**Réponse (200) :**
```json
{
  "message": "logo mis à jour."
}
```

---

### Supprimer un logo

```
DELETE /api/logos/{id}
```

**Réponse (200) :**
```json
{
  "message": "logo supprimé."
}
```

---

## Logos de divisions

### Récupérer tous les logos de divisions

```
GET /api/logo_divisions
```

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "name": "Ligue 1",
    "initials": "L1",
    "image": "base64_ou_url"
  }
]
```

---

### Créer un logo de division

```
POST /api/logo_divisions
```

**Corps de la requête :**
```json
{
  "name": "Ligue 1",
  "initials": "L1",
  "image": "base64_ou_url"
}
```

**Champs requis :** `name`, `image`

**Réponse (201) :**
```json
{
  "id": 1,
  "message": "Logo de la division créé avec succès"
}
```

---

### Récupérer un logo de division par ID

```
GET /api/logo_divisions/{id}
```

**Réponse (200) :**
```json
{
  "id": 1,
  "name": "Ligue 1",
  "initials": "L1",
  "image": "base64_ou_url"
}
```

---

### Modifier un logo de division

```
PUT /api/logo_divisions/{id}
```

**Corps de la requête :**
```json
{
  "name": "Nouveau nom",
  "initials": "NN",
  "image": "nouvelle_image"
}
```

**Réponse (200) :**
```json
{
  "message": "division_logo mis à jour."
}
```

---

### Supprimer un logo de division

```
DELETE /api/logo_divisions/{id}
```

**Réponse (200) :**
```json
{
  "message": "division_logo supprimé."
}
```

---

## Badges

### Récupérer tous les badges

```
GET /api/badges
```

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "name": "Capitaine",
    "initials": "CAP",
    "image": "base64_ou_url"
  }
]
```

---

### Créer un badge

```
POST /api/badges
```

**Corps de la requête :**
```json
{
  "name": "Capitaine",
  "initials": "CAP",
  "image": "base64_ou_url"
}
```

**Champs requis :** `name`, `image`

**Réponse (201) :**
```json
{
  "id": 1,
  "message": "Badge créé avec succès"
}
```

---

### Récupérer un badge par ID

```
GET /api/badges/{id}
```

**Réponse (200) :**
```json
{
  "id": 1,
  "name": "Capitaine",
  "initials": "CAP",
  "image": "base64_ou_url"
}
```

---

### Modifier un badge

```
PUT /api/badges/{id}
```

**Corps de la requête :**
```json
{
  "name": "Nouveau nom",
  "initials": "NN",
  "image": "nouvelle_image"
}
```

**Réponse (200) :**
```json
{
  "message": "Badge mis à jour."
}
```

---

### Supprimer un badge

```
DELETE /api/badges/{id}
```

**Réponse (200) :**
```json
{
  "message": "Badge supprimé."
}
```

---

## Authentification Staff

### Connexion staff

```
POST /api/staff/auth
```

**Description :** Authentifie un membre du staff avec le code d'accès.

**Corps de la requête :**
```json
{
  "password": "code_acces_staff"
}
```

**Réponse (200) :**
```json
{
  "success": true
}
```
Un cookie `staff_auth` est défini avec une durée de 24 heures.

**Réponse (401) :**
```json
{
  "error": "Invalid password"
}
```

---

### Déconnexion staff

```
POST /api/staff/logout
```

**Description :** Déconnecte le membre du staff en supprimant le cookie d'authentification.

**Réponse (200) :**
```json
{
  "success": true
}
```

---

## Types de données

### PlayerData

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique (auto-généré) |
| `firstname` | string | Prénom du joueur |
| `lastname` | string | Nom du joueur |
| `nationality1` | string | Code pays nationalité principale (ex: "FR") |
| `nationality2` | string | Code pays 2ème nationalité |
| `nationality3` | string | Code pays 3ème nationalité |
| `internationals` | string | Sélections internationales |
| `player_image` | string | URL ou base64 de la photo |
| `date_of_birth` | string | Date de naissance (YYYY-MM-DD) |
| `preferred_foot` | string | Pied préféré ("Droit", "Gauche", "Les deux") |
| `height` | number | Taille en cm |
| `weight` | number | Poids en kg |
| `primary_position` | string | Poste principal (ex: "AIG", "GB", "MD") |
| `secondary_position` | string | Poste secondaire |
| `vma` | number | Vitesse Maximale Aérobie |
| `transfermark_url` | string | Lien Transfermarkt |
| `qualities` | string | Qualités séparées par des virgules |
| `email` | string | Email du joueur |
| `phone` | string | Téléphone du joueur |
| `email_agent` | string | Email de l'agent |
| `phone_agent` | string | Téléphone de l'agent |

### Season

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique |
| `resume_id` | number | ID du CV associé |
| `duration` | string | Période (ex: "2023-2024") |
| `current_season` | boolean | Saison en cours |
| `is_split` | boolean | Saison divisée (2 clubs) |
| `clubSeasons` | ClubSeason[] | Détails par club |

### ClubSeason

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique |
| `season_id` | number | ID de la saison |
| `name` | string | Nom du club |
| `division` | string | Division/Championnat |
| `category` | string | Catégorie (Sénior, U19, etc.) |
| `matchs` | number | Nombre de matchs joués |
| `goals` | number | Nombre de buts |
| `assists` | number | Nombre de passes décisives |
| `average_playing_time` | number | Temps de jeu moyen (min) |
| `half_number` | number | 1 ou 2 si saison divisée |
| `logo_club` | string | Logo du club (base64/URL) |
| `logo_division` | string | Logo de la division |
| `comment1-3` | string | Commentaires (jusqu'à 3) |
| `badge1-3` | string | Badges associés (jusqu'à 3) |

### Formation

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique |
| `resume_id` | number | ID du CV associé |
| `duration` | string | Période de formation |
| `title` | string | Titre/Nom du centre |
| `details` | string | Détails de la formation |

### Essai

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | ID unique |
| `resume_id` | number | ID du CV associé |
| `club` | string | Nom du club |
| `year` | string | Année de l'essai |

---

## Codes d'erreur HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide (paramètres manquants) |
| 401 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `STAFF_ACCESS_CODE` | Code d'accès pour l'authentification staff |

---

## Exemples d'utilisation

### Créer un CV complet avec fetch

```javascript
const response = await fetch('http://localhost:3000/api/resumes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cv_color: '#1E5EFF',
    composition_to_display: '4-3-3',
    playerData: {
      firstname: 'Jean',
      lastname: 'Dupont',
      nationality1: 'FR',
      // ... autres champs
    },
    seasons: [],
    formations: [],
    essais: []
  })
});

const data = await response.json();
console.log('CV créé avec ID:', data.resumeId);
```

### Télécharger un PDF

```javascript
const response = await fetch('/api/generate-cv?id=1');
const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url, '_blank');
```
