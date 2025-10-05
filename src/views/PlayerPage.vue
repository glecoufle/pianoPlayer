<template>
  <ion-page>
    <ion-header :translucent="true" class="transparent-header">
      <ion-toolbar color="clear">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" class="transparent-back-button">
          </ion-back-button>

          <ion-button
            size="large"
            class="transparent-color-button"
            style="margin-left: 250px"
            @click="play"
            >Play</ion-button
          >

          <ion-button
            size="large"
            style="margin-left: 50px"
            class="transparent-color-button"
            @click="range"
            >Range</ion-button
          >

          <ion-button
            size="large"
            style="margin-left: 50px"
            class="transparent-color-button"
            @click="switchColor"
            >Color</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="fullscreen-content">
      <div class="player-container">
        <!-- Component Partition above -->
        <div class="partition-section">
          <PartitionComponent
            ref="partitionRef"
            :colorize="colorizeNote"
            :nbRange="nbRange"
          />
        </div>

        <!-- Component Piano below -->
        <div class="piano-section">
          <PianoComponent @note-played="handleNotePlayed" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
} from "@ionic/vue";
import PartitionComponent from "@/components/PartitionComponent.vue";
import PianoComponent from "@/components/PianoComponent.vue";

const partitionRef = ref<InstanceType<typeof PartitionComponent>>();

const colorizeNote = ref<boolean>(false);
const nbRange = ref<number>(3);

// Load nbRange from localStorage
const loadSettings = () => {
  const savedRange = localStorage.getItem("piano-octave-range");
  if (savedRange) {
    nbRange.value = parseInt(savedRange, 10);
  }
};

// Listen for settings updates
const handleSettingsUpdate = () => {
  loadSettings();
};

const play = () => {
  partitionRef.value?.clearNotes();
  partitionRef.value?.stopAnimation();
  partitionRef.value?.startAnimation();
};

const range = () => {
  partitionRef.value?.stopAnimation();
  partitionRef.value?.clearNotes();
  partitionRef.value?.displayAllNotes();
};

const switchColor = () => {
  if (colorizeNote.value) {
    colorizeNote.value = false;
  } else {
    colorizeNote.value = true;
  }
};

// Add this handler for the PianoComponent event
const handleNotePlayed = (note: any) => {
  console.log("Note played from PianoComponent:", note);
};

// Load settings on mount and listen for updates
onMounted(() => {
  loadSettings();
  window.addEventListener("storage", handleSettingsUpdate);
  window.addEventListener("piano-settings-updated", handleSettingsUpdate);
});

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener("storage", handleSettingsUpdate);
  window.removeEventListener("piano-settings-updated", handleSettingsUpdate);
});
</script>

<style scoped>
.player-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.partition-section {
  flex: 1;
  height: 50vh;
  max-height: 50vh;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  overflow: hidden;
}

.piano-section {
  flex: 1;
  height: 50vh;
  max-height: 50vh;
  background: #ffffff;
  padding: 5px;
  overflow: hidden;
}

/* Fullscreen content */
.fullscreen-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

/* Header transparent */
.transparent-header {
  --background: transparent;
}

.transparent-header ion-toolbar {
  --background: transparent;
  --border-color: transparent;
  --color: #333;
}

.transparent-back-button {
  --color: #333;
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 50%;
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 2px;
  position: fixed;

  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.transparent-color-button {
  font-size: x-large;
  color: #ff0000;
  --color: #ff0000;
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 50%;
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 100px;
  height: 50px;
  top: -20px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .partition-section {
    height: 50vh;
    max-height: 50vh;
  }

  .piano-section {
    height: 50vh;
    max-height: 50vh;
  }

  .transparent-back-button {
    width: 35px;
    height: 35px;
    top: -20px;
    left: 5px;
  }
}
</style>
