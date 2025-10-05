# Piano Player - Architecture des Fichiers

## 📁 Structure Modulaire

### 🎵 Types (`/src/types/`)

- **`AnimatedNote.ts`** - Interface pour les notes animées avec position et état
- **`Note.ts`** - Interface pour les notes musicales avec fréquence et lignes supplémentaires
- **`LedgerLine.ts`** - Interface pour les lignes supplémentaires (au-dessus/en-dessous)
- **`index.ts`** - Point d'entrée centralisé pour tous les types

### 📊 Données (`/src/data/`)

- **`allNotes.ts`** - Définition complète de toutes les notes musicales avec :
  - Positions sur la portée
  - Fréquences audio
  - Configuration des lignes supplémentaires
  - Fonctions utilitaires (`getNotePosition`, `getRandomNote`)

### 🔧 Utilitaires (`/src/utils/`)

### 🎹 Composants (`/src/components/`)

- **`PartitionComponent.vue`** - Composant principal allégé qui importe :
  - Types depuis `/types/`
  - Données depuis `/data/allNotes`
  - Utilitaires depuis `/utils/ledgerLines`

## 🚀 Avantages de cette Architecture

### ✅ **Lisibilité**

- Code séparé par responsabilité
- Interfaces clairement définies
- Imports explicites et organisés

### ✅ **Maintenabilité**

- Modifications isolées par fichier
- Réutilisabilité des types et fonctions
- Tests unitaires plus faciles

### ✅ **Performance**

- Tree-shaking optimal
- Imports sélectifs
- Pas de duplication de code

## 📝 Exemple d'Utilisation

\`\`\`typescript
// Import centralisé des types
import type { AnimatedNote, Note, LedgerLine } from "../types";

// Import des données musicales
import { allNotes, getRandomNote } from "../data/allNotes";

// Import des utilitaires
import { needsLedgerLine } from "../utils/ledgerLines";
\`\`\`

## 🔄 Migration Effectuée

- ✅ Extraction des interfaces vers `/types/`
- ✅ Migration des données musicales vers `/data/`
- ✅ Création des utilitaires dans `/utils/`
- ✅ Nettoyage du PartitionComponent.vue
- ✅ Suppression du code dupliqué
- ✅ Imports optimisés
