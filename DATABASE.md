# Schéma de Base de Données - Scoutify

## Diagramme Entité-Relation

```mermaid
erDiagram
    PlayerData ||--|| Resume : "possède"
    Resume ||--o{ Season : "contient"
    Resume ||--o{ Formations : "contient"
    Resume ||--o{ Essais : "contient"
    Resume ||--o{ International : "contient"
    Resume ||--o{ Link : "contient"
    Season ||--o{ Club_Season : "contient"

    PlayerData {
        INTEGER id PK
        TEXT firstname
        TEXT lastname
        TEXT nationality1
        TEXT nationality2
        TEXT nationality3
        TEXT internationals
        TEXT player_image
        DATE date_of_birth
        TEXT preferred_foot
        REAL height
        REAL weight
        TEXT primary_position
        TEXT secondary_position
        REAL vma
        TEXT transfermark_url
        TEXT qualities
        TEXT email
        TEXT phone
        TEXT email_agent
        TEXT phone_agent
    }

    Resume {
        INTEGER id PK
        INTEGER player_data_id FK
        DATE created_at
        DATE updated_at
        BOOLEAN is_treated
        TEXT cv_color
        TEXT composition_to_display
        TEXT comments
    }

    Season {
        INTEGER id PK
        INTEGER resume_id FK
        TEXT duration
        BOOLEAN current_season
        BOOLEAN is_split
    }

    Club_Season {
        INTEGER id PK
        INTEGER season_id FK
        TEXT name
        TEXT division
        TEXT category
        TEXT logo_division
        TEXT logo_club
        INTEGER matchs
        INTEGER goals
        INTEGER assists
        INTEGER average_playing_time
        INTEGER half_number
        TEXT comment1
        TEXT badge1
        TEXT comment2
        TEXT badge2
        TEXT comment3
        TEXT badge3
    }

    Formations {
        INTEGER id PK
        INTEGER resume_id FK
        TEXT duration
        TEXT title
        TEXT details
    }

    Essais {
        INTEGER id PK
        INTEGER resume_id FK
        TEXT club
        TEXT year
    }

    International {
        INTEGER id PK
        INTEGER resume_id FK
        TEXT country_code
    }

    Link {
        INTEGER id PK
        INTEGER resume_id FK
        TEXT url
        TEXT link_type
    }

    Badge {
        INTEGER id PK
        TEXT name
        TEXT initials
        TEXT image
    }

    Logo {
        INTEGER id PK
        TEXT name
        TEXT initials
        TEXT image
    }

    Division_Logo {
        INTEGER id PK
        TEXT name
        TEXT initials
        TEXT image
    }
```

## Description des tables

### Tables principales (CV)

- **PlayerData** — Informations personnelles du joueur (identité, nationalités, mensurations, contact)
- **Resume** — CV du joueur avec ses préférences d'affichage (couleur, composition)
- **Season** — Saison sportive (peut être divisée en 2 clubs)
- **Club_Season** — Détails et statistiques pour un club dans une saison
- **Formations** — Parcours de formation sportive
- **Essais** — Essais effectués dans d'autres clubs
- **International** — Sélections internationales (U19, U21, etc.)
- **Link** — Liens externes (vidéos, réseaux sociaux)

### Tables de ressources (Staff)

- **Badge** — Badges/distinctions attribuables aux saisons
- **Logo** — Logos des clubs
- **Division_Logo** — Logos des championnats/divisions

## Relations

```mermaid
flowchart TD
    subgraph CV["CV du Joueur"]
        PD[PlayerData] --> R[Resume]
        R --> S[Season]
        R --> F[Formations]
        R --> E[Essais]
        R --> I[International]
        R --> L[Link]
        S --> CS[Club_Season]
    end
    
    subgraph Resources["Ressources Staff"]
        B[Badge]
        LO[Logo]
        DL[Division_Logo]
    end
    
    CS -.->|référence| B
    CS -.->|référence| LO
    CS -.->|référence| DL
```

## Cardinalités

- Un **PlayerData** possède exactement un **Resume** (1:1)
- Un **Resume** peut avoir plusieurs **Season** (1:N)
- Une **Season** peut avoir 1 ou 2 **Club_Season** (saison normale ou split)
- Un **Resume** peut avoir plusieurs **Formations**, **Essais**, **International**, **Link** (1:N)
