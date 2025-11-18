<template>
  <div class="partition-container">
    <ion-card>
      <ion-card-content>
        <div class="staff">
          <!-- Display the key {{ theKey }}  -->
          <div v-if="theKey === 'F'" class="treble-clef FKey">𝄢</div>
          <div v-else-if="theKey === 'C'" class="treble-clef CKey">𝄡</div>
          <div v-else class="treble-clef GKey">𝄞</div>

          <!-- Staff OF 5 lines   -->
          <div class="staff-lines">
            <div class="line" v-for="i in 5" :key="i"></div>
          </div>

          <!-- Container for animated notes -->
          <div class="notes-container">
            <!-- Animated notes -->
            <div
              v-for="animatedNote in animatedNotes"
              :key="`animated-${animatedNote.id}`"
              class="animated-note"
              :class="{
                highlighted: animatedNote.isHighlighted,
              }"
              :style="{
                color: animatedNote.error
                  ? 'red'
                  : props.colorize
                  ? getColorNote(animatedNote.note.noteType)
                  : '#333',

                left: animatedNote.x + 'px',
                top: animatedNote.y + 'px',
              }"
            >
              ♩
              <!-- added lines if animatedNote.note.lines?.above1 -->
              <div
                v-if="animatedNote.note.lines?.above3"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    109 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>
              <div
                v-if="animatedNote.note.lines?.above2"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    120 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>
              <div
                v-if="animatedNote.note.lines?.above1"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    129 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>

              <!-- added lines if animatedNote.note.lines?.below1 -->
              <div
                v-if="animatedNote.note.lines?.below1"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    29 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>
              <div
                v-if="animatedNote.note.lines?.below2"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    39 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>
              <div
                v-if="animatedNote.note.lines?.below3"
                class="lineAdded"
                :style="{
                  top:
                    animatedNote.y +
                    49 -
                    (animatedNote.note.shiftLinePosition ?? 0) +
                    'px',
                }"
              ></div>
            </div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { IonCard, IonCardContent } from "@ionic/vue";
import type { AnimatedNote, Note } from "../types";
import { getRangeNotes, getRandomNote, getColorNote } from "../data/allNotes";
import { AudioService } from "../services/AudioService";

const props = defineProps({
  colorize: {
    type: Boolean,
    default: false,
  },
  nbRange: {
    type: Number,
    default: 3,
  },
  theKey: {
    type: String,
    default: "G",
  },
  key: {
    type: String,
    default: "",
  },
});

const allNotes = computed(() => getRangeNotes(props.nbRange, props.theKey));

const animatedNotes = ref<AnimatedNote[]>([]);
const animationId = ref<number | null>(null);
const speedAnimation = ref<number>(5); // Speed of the animation (px per frame)
const highlightedNote = ref<AnimatedNote | null>(null);

// Instance du service audio pour jouer les vrais sons
const audioService = new AudioService(true);

const noteIdCounter = ref(0);
const staffWidth = 650;
const clefPosition = 75;
const noteSpacing = 50;

const clearNotes = () => {
  animatedNotes.value = [];
};

// Function to add a note (called by the piano)
const addNote = (animatedNote: AnimatedNote) => {
  if (animatedNotes.value.length > 10) {
    return;
  }
  animatedNotes.value.push(animatedNote);
};

// Function to sort notes by their position property
const sortNotesByPosition = (notes: Record<string, Note>) => {
  return Object.entries(notes)
    .sort(([, a], [, b]) => b.position - a.position)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, Note>);
};

// The getRandomNote function is now imported from /data/allNotes.ts

// Function to add a new animated note
const addAnimatedNote = (position: number | undefined) => {
  const aNote = getRandomNote(props.nbRange, props.theKey);
  const newNote: AnimatedNote = {
    id: noteIdCounter.value++,
    x: position ?? staffWidth, // Start all the way to the right (460px)
    y: aNote.position, // Vertical position according to the note
    isHighlighted: animatedNotes.value.length === 0, // The first note is highlighted
    note: aNote,
    error: false,
  };

  if (newNote.isHighlighted) {
    highlightedNote.value = newNote;
  }

  // Ensure that other notes are no longer highlighted
  //animatedNotes.value.forEach((note) => (note.isHighlighted = false));
  animatedNotes.value.push(newNote);
};

// Animation of the notes
const animateNotes = () => {
  //  Check if the first note has reached the stop position (10px from the treble clef)
  if (
    animatedNotes.value.length > 0 &&
    animatedNotes.value[0].x <= clefPosition
  ) {
    // Stop the animation
    speedAnimation.value = 0;
  }

  // modify the speed, it depends on the highlighted note position
  if (highlightedNote.value) {
    const speed = 6 - (staffWidth - highlightedNote.value.x) / 100;
    if (speed < 0.4) {
      // Stop the animation
      speedAnimation.value = 0;
    } else {
      // reduce the speed as it approaches the clef
      speedAnimation.value = speed;
    }
  } else {
    speedAnimation.value = 5;
  }

  for (let index = 0; index < animatedNotes.value.length; index++) {
    const note = animatedNotes.value[index];
    note.x -= speedAnimation.value; // Speed of movement (1px per frame)

    // Remove notes that have passed the treble clef (except the highlighted note)
    if (note.x <= clefPosition + 5 && note.id !== highlightedNote.value?.id) {
      animatedNotes.value.splice(index, 1);
    }
  }

  // Add a new note periodically (respecting the 50px spacing)
  const shouldAddNote =
    animatedNotes.value.length === 0 ||
    animatedNotes.value[animatedNotes.value.length - 1].x <=
      staffWidth - noteSpacing;

  if (shouldAddNote) {
    addAnimatedNote(staffWidth);
  }

  animationId.value = requestAnimationFrame(animateNotes);
};

// Start the animation
const startAnimation = () => {
  setTimeout(() => addAnimatedNote(staffWidth), 250);

  animateNotes();
};

// Stop the animation
const stopAnimation = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
};

// Function for displaying all notes
const displayAllNotes = () => {
  debugger;
  const sortedNotes = sortNotesByPosition(allNotes.value);

  let noteId = 0;

  // Erase current notes
  animatedNotes.value = [];

  // Display all notes with 30px spacing
  for (const noteName in sortedNotes) {
    const newNote: AnimatedNote = {
      id: noteId++,
      note: sortedNotes[noteName],
      x: 75 + noteId * 30, // 30px spacing starting after the key
      y: sortedNotes[noteName].position,
      isHighlighted: false, // no need to highlighted note
      error: false,
    };

    animatedNotes.value.push(newNote);
  }
};

async function handleNotePlayed(event: CustomEvent): Promise<void> {
  const noteName = event.detail;
  console.log("Note played event received in PartitionComponent:", noteName);

  if (highlightedNote.value?.note.noteType === noteName) {
    console.log("Correct note played:", noteName);

    // Initialiser le contexte audio si nécessaire
    await audioService.init();

    // Jouer le vrai son de la note
    try {
      if (highlightedNote.value?.note.name) {
        await audioService.playNote(highlightedNote.value?.note.name, 0.7); // Volume à 70%
        console.log(`Son joué pour la note: ${noteName}`);

        // wait 0.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 500));
        // stop the note
        await audioService.stopNote(highlightedNote.value?.note.name);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la lecture du son pour ${noteName}:`,
        error
      );
    }
  } else {
    // The played note does not match the highlighted note
    console.log("Note not found in current range:", noteName);
    // color the note in red
    if (highlightedNote.value) {
      highlightedNote.value.error = true;
    }
  }

  // Always change the highlight to the next note
  // Update the highlight to the next note in the animatedNotes
  if (animatedNotes.value.length > 0) {
    const currentIndex = animatedNotes.value.findIndex(
      (note) => note.id === highlightedNote.value?.id
    );

    if (currentIndex !== -1) {
      animatedNotes.value[currentIndex].isHighlighted = false;
    }
    // set the highlighted attribute on the next element
    if (currentIndex + 1 < animatedNotes.value.length) {
      animatedNotes.value[currentIndex + 1].isHighlighted = true;
      highlightedNote.value = animatedNotes.value[currentIndex + 1];
    }
  }
}

// Wrapper function pour EventListener
const handleNotePlayedWrapper = (event: Event) => {
  handleNotePlayed(event as CustomEvent);
};

// Lifecycle hooks
onMounted(async () => {
  console.log(
    "Partition component mounted with nbRange: " +
      props.nbRange +
      ", key: " +
      props.theKey
  );

  // Test audio pour vérifier que ça marche
  // setTimeout(() => {
  //   console.log("🧪 Test audio dans 2 secondes...");
  //   audioService.testSound();
  // }, 2000);

  // Les sons de fréquence n'ont pas besoin d'être préchargés
  console.log("Service audio initialisé en mode fréquence");

  globalThis.addEventListener("note-played", handleNotePlayedWrapper);
  startAnimation(); // Start the animation
});

onUnmounted(() => {
  console.log("Partition component unmounted");
  stopAnimation();
  audioService.stopAll(); // Arrêter le service audio
  globalThis.removeEventListener("note-played", handleNotePlayedWrapper);
});

// Expose the methods to the parent component
defineExpose({
  addNote,
  clearNotes,
  displayAllNotes,
  startAnimation,
  stopAnimation,
});
</script>

<style scoped>
.partition-container {
  padding: 5px;
}

.staff {
  position: relative;
  height: 280px;
  background: white;
  margin: 10px 0;
  border-radius: 8px;
  overflow: visible;
}

.staff-lines {
  position: absolute;
  top: 50px;
  left: 10px;
  right: 8px;
  height: 80px;
}

.line {
  height: 2px;
  background-color: #333;
  margin: 8px 0;
}

.notes-container {
  position: relative;
  height: 100%;
}

.treble-clef {
  position: absolute;
  left: 8px;
  font-size: 60px;
  color: #333;
  font-weight: bold;
  line-height: 1;
  transform: translateY(-10px);
}

.GKey {
  top: 58px;
}

.FKey {
  top: 63px;
}

.CKey {
  top: 61px;
}
/* added lines for notes above/below the staff */
.lineAdded {
  position: fixed;
  height: 2px;
  width: 25px;
  background-color: #333;
  z-index: -1;
}

.note {
  position: absolute;
  font-size: 70px;
  color: #333;
  font-weight: bold;
  transform: translateX(-50%);
}

.animated-note {
  position: absolute;
  font-size: 70px;
  color: #333;
  font-weight: bold;
  transform: translateX(-50%);
  transition: none;
}

.animated-note.highlighted:before {
  content: "";
  width: 50px;
  height: 50px;
  position: absolute;
  left: -10px;
  top: 45px;
  background: #220607;
  display: inline-block;
  --background: transparent;
  border-radius: 50%;
  opacity: 0.3;
  z-index: -1;
}
</style>
