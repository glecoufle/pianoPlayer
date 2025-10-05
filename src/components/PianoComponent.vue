<template>
  <div class="piano-container">
    <ion-card>
      <ion-card-content>
        <div class="piano-keys">
          <button
            v-for="note in notes"
            :key="note.name"
            class="piano-key"
            :class="{ pressed: pressedKeys.includes(note.name) }"
            :style="{ backgroundColor: note.color }"
            @mousedown.stop="playNote(note.name)"
            @touchstart.prevent.stop="playNote(note.name)"
            @mouseup.stop="stopNote(note.name)"
            @mouseleave.stop="stopNote(note.name)"
            @touchend.prevent.stop="stopNote(note.name)"
          >
            <div class="key-info">
              <span class="note-name">{{ note.name }}</span>
              <span class="shortcut-key">{{
                getShortcutForNote(note.name)
              }}</span>
            </div>
          </button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { IonCard, IonCardContent } from "@ionic/vue";

interface Note {
  name: string;
  color: string;
}

// Piano notes with their colors and frequencies
const notes = ref<Note[]>([
  { name: "Do", color: "#FF0000" },
  { name: "Re", color: "#FF7F00" },
  { name: "Mi", color: "#FFFF00" },
  { name: "Fa", color: "#00FF00" },
  { name: "Sol", color: "#0000FF" },
  { name: "La", color: "#4B0082" },
  { name: "Si", color: "#8B00FF" },
]);

const pressedKeys = ref<string[]>([]);
const lastPlayedNote = ref<string>("");

// Default keyboard shortcuts configuration
const defaultKeyBindings = ref<{ [key: string]: string }>({
  "1": "Do", // 1 for Do
  "2": "Re", // 2 for Re
  "3": "Mi", // 3 for Mi
  "4": "Fa", // 4 for Fa
  "5": "Sol", // 5 for Sol
  "6": "La", // 6 for La
  "7": "Si", // 7 for Si
});

// Get configuration from localStorage or use defaults
const keyBindings = ref<{ [key: string]: string }>({
  ...defaultKeyBindings.value,
});

// Load saved configuration
const loadKeyBindings = () => {
  const saved = localStorage.getItem("piano-key-bindings");
  if (saved) {
    try {
      keyBindings.value = { ...defaultKeyBindings.value, ...JSON.parse(saved) };
    } catch (error) {
      console.warn("Error loading keyboard shortcuts:", error);
    }
  }
};

// Save configuration
const saveKeyBindings = () => {
  localStorage.setItem("piano-key-bindings", JSON.stringify(keyBindings.value));
};

// Get keyboard shortcut for a note
const getShortcutForNote = (noteName: string): string => {
  for (const [key, note] of Object.entries(keyBindings.value)) {
    if (note === noteName) {
      return key.toUpperCase();
    }
  }
  return "";
};

// Define emissions
const emit = defineEmits<{
  "note-played": [noteName: string];
}>();

const playNote = (noteName: string) => {
  // Avoid duplicates - only play if note is not already active
  if (!pressedKeys.value.includes(noteName)) {
    pressedKeys.value.push(noteName);
    lastPlayedNote.value = noteName;

    // Emit event to parent component
    emit("note-played", noteName);
    // Trigger an event for the PlayerPage to reload the config
    window.dispatchEvent(new CustomEvent("note-played", { detail: noteName }));
  }
};

const stopNote = (noteName: string) => {
  const index = pressedKeys.value.indexOf(noteName);
  if (index > -1) {
    pressedKeys.value.splice(index, 1);
  }
};

// Keyboard event handling
const handleKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const noteName = keyBindings.value[key];

  if (noteName && !event.repeat) {
    event.preventDefault();
    event.stopPropagation();
    playNote(noteName);
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const noteName = keyBindings.value[key];

  if (noteName) {
    event.preventDefault();
    event.stopPropagation();
    stopNote(noteName);
  }
};

// Listen for configuration updates
const handleSettingsUpdate = () => {
  loadKeyBindings();
};

// Lifecycle hooks to add/remove event listeners
onMounted(() => {
  loadKeyBindings();
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("piano-settings-updated", handleSettingsUpdate);
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  window.removeEventListener("piano-settings-updated", handleSettingsUpdate);
});

// Expose functions for parent component
defineExpose({
  keyBindings,
  saveKeyBindings,
  loadKeyBindings,
});
</script>

<style scoped>
.piano-container {
  padding: 2px;
  height: 100%;
}

.piano-keys {
  display: flex;
  gap: 4px;
  justify-content: stretch;
  width: 100%;
  padding: 0 5px;
  margin: 5px 0;
}

.piano-key {
  flex: 1;
  min-width: 0;
  height: 120px;
  border: 3px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.piano-key:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.piano-key.pressed {
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.key-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.note-name {
  font-size: 16px;
  font-weight: bold;
}

.shortcut-key {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
  padding: 1px 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .piano-key {
    height: 90px;
  }

  .note-name {
    font-size: 12px;
  }

  .shortcut-key {
    font-size: 8px;
  }

  .piano-keys {
    gap: 2px;
    padding: 0 2px;
  }
}
</style>
