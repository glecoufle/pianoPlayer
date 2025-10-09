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
              <ion-label>Octave</ion-label>
              <ion-select
                interface="action-sheet"
                v-model="selectedRange"
                placeholder="Select octave"
                @ionChange="saveRange($event.detail.value)"
              >
                <ion-select-option value="1">1</ion-select-option>
                <ion-select-option value="2">2</ion-select-option>
                <ion-select-option value="3">3</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>

          <ion-card-content>
            <ion-item>
              <ion-label>Key</ion-label>
              <ion-select
                interface="action-sheet"
                v-model="selectedKey"
                placeholder="Select key"
                @ionChange="saveKey($event.detail.value)"
              >
                <ion-select-option value="G" class="key-option"
                  >𝄞</ion-select-option
                >
                <ion-select-option value="F" class="key-option"
                  >𝄢</ion-select-option
                >
                <ion-select-option value="E" class="key-option"
                  >𝄡</ion-select-option
                >
              </ion-select>
            </ion-item>
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
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

// Notes for the piano
const selectedRange = ref(3);
const selectedKey = ref("G");

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

// save the selected key
const saveKey = (keyValue: string) => {
  console.log("key selected:", keyValue);
  selectedKey.value = keyValue;
  localStorage.setItem("piano-key", keyValue);
  // Trigger an event for the PlayerPage to reload the config
  window.dispatchEvent(new CustomEvent("piano-settings-updated"));
};

// Set the configuration
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

.key-option {
  font-size: 36px;
  text-align: center;
}
</style>
