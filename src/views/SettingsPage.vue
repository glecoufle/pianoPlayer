<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="settings-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Piano Settings</ion-card-title>
            <ion-card-subtitle>Configure your piano player</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label>Volume</ion-label>
              <ion-range :min="0" :max="100" :value="50" :pin="true">
                <ion-icon name="volume-low" slot="start"></ion-icon>
                <ion-icon name="volume-high" slot="end"></ion-icon>
              </ion-range>
            </ion-item>

            <ion-item>
              <ion-label>Octave</ion-label>
              <ion-select
                v-model="selectedRange"
                placeholder="Select octave"
                @ionChange="saveRange($event.detail.value)"
              >
                <ion-select-option value="1">1</ion-select-option>
                <ion-select-option value="2">2</ion-select-option>
                <ion-select-option value="3">3</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-checkbox slot="start"></ion-checkbox>
              <ion-label>Show note names</ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Configure keyboard shortcuts -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Keyboard Shortcuts</ion-card-title>
            <ion-card-subtitle
              >Customize the keys for each note</ion-card-subtitle
            >
          </ion-card-header>
          <ion-card-content>
            <div class="keyboard-config">
              <ion-item
                v-for="note in notes"
                :key="note"
                class="key-binding-item"
              >
                <ion-label>{{ note }}</ion-label>
                <ion-input
                  v-model="keyBindings[getKeyForNote(note)]"
                  @ionInput="updateKeyBinding(note, $event)"
                  @keydown.prevent="captureKey(note, $event)"
                  :placeholder="'Touch for ' + note"
                  readonly
                  class="key-input"
                ></ion-input>
                <ion-button
                  fill="clear"
                  @click="resetKeyBinding(note)"
                  slot="end"
                  size="small"
                >
                  <ion-icon name="reset"></ion-icon>
                </ion-button>
              </ion-item>
            </div>

            <div class="button-group">
              <ion-button
                expand="block"
                @click="resetAllKeys"
                color="secondary"
              >
                <ion-icon name="reset" slot="start"></ion-icon>
                Reinit all keys
              </ion-button>
              <ion-button expand="block" @click="saveSettings" color="primary">
                <ion-icon name="save" slot="start"></ion-icon>
                Save Settings
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonRange,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonInput,
  IonButton,
  alertController,
} from "@ionic/vue";

// Notes for the piano
const notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
const selectedRange = ref(3);

// Default key bindings
const defaultKeyBindings = {
  "1": "Do",
  "2": "Re",
  "3": "Mi",
  "4": "Fa",
  "5": "Sol",
  "6": "La",
  "7": "Si",
};

// Current state of key bindings
const keyBindings = ref<{ [key: string]: string }>({ ...defaultKeyBindings });
const keyValues = ref<{ [note: string]: string }>({});

// save the selected range
const saveRange = (range: number) => {
  selectedRange.value = range;
  localStorage.setItem("piano-octave-range", range.toString());
  // Trigger an event for the PlayerPage to reload the config
  window.dispatchEvent(new CustomEvent("piano-settings-updated"));
};

// Charger la configuration
const loadSettings = () => {
  const saved = localStorage.getItem("piano-key-bindings");
  if (saved) {
    try {
      keyBindings.value = { ...defaultKeyBindings, ...JSON.parse(saved) };
    } catch (error) {
      console.warn("Error loading settings:", error);
    }
  }

  // Load saved range
  const savedRange = localStorage.getItem("piano-octave-range");
  if (savedRange) {
    selectedRange.value = parseInt(savedRange, 10);
  }

  updateKeyValues();
};

// Update display values
const updateKeyValues = () => {
  keyValues.value = {};
  for (const [key, note] of Object.entries(keyBindings.value)) {
    keyValues.value[note] = key.toUpperCase();
  }
};

// Get the key for a note
const getKeyForNote = (note: string): string => {
  return keyValues.value[note] || "";
};

// Capture a new key
const captureKey = (note: string, event: KeyboardEvent) => {
  event.preventDefault();
  const newKey = event.key.toLowerCase();

  if (newKey === "escape" || newKey === "enter") return;

  // Remove the old association
  const oldKey = Object.keys(keyBindings.value).find(
    (k) => keyBindings.value[k] === note
  );
  if (oldKey) delete keyBindings.value[oldKey];

  // Remove if the new key was already assigned
  if (keyBindings.value[newKey]) {
    delete keyBindings.value[newKey];
  }

  // Add the new association
  keyBindings.value[newKey] = note;
  updateKeyValues();
};

// Update a key binding
const updateKeyBinding = (note: string, event: any) => {
  console.log("Update key binding called" + note + event);
  // This function is called by ionInput but we use keydown instead
};

// Reset a key binding
const resetKeyBinding = (note: string) => {
  const defaultKey = Object.keys(defaultKeyBindings).find(
    (k) => defaultKeyBindings[k as keyof typeof defaultKeyBindings] === note
  );
  if (defaultKey) {
    // Remove the old association
    const oldKey = Object.keys(keyBindings.value).find(
      (k) => keyBindings.value[k] === note
    );
    if (oldKey) delete keyBindings.value[oldKey];

    // Supprimer si la touche par défaut était assignée ailleurs
    if (keyBindings.value[defaultKey]) {
      delete keyBindings.value[defaultKey];
    }

    keyBindings.value[defaultKey] = note;
    updateKeyValues();
  }
};

// Reset all key bindings
const resetAllKeys = async () => {
  const alert = await alertController.create({
    header: "Confirmation",
    message: "Do you really want to reset all key bindings?",
    buttons: [
      "Cancel",
      {
        text: "Confirm",
        handler: () => {
          keyBindings.value = { ...defaultKeyBindings };
          updateKeyValues();
        },
      },
    ],
  });
  await alert.present();
};

// Save settings
const saveSettings = () => {
  localStorage.setItem("piano-key-bindings", JSON.stringify(keyBindings.value));

  // Trigger an event for the piano to reload the config
  window.dispatchEvent(new CustomEvent("piano-settings-updated"));
};

// Load settings on mount
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.keyboard-config {
  margin: 20px 0;
}

.key-binding-item {
  margin: 10px 0;
}

.key-input {
  max-width: 80px;
  text-align: center;
  font-weight: bold;
  background: #f0f0f0;
  border-radius: 4px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
