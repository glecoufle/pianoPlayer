<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Piano Player Sol Fa Mi Reader</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Piano Player Sol Fa Mi Reader</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Piano Player Sol Fa Mi Reader</strong>
        <p>Welcome to your virtual piano app !</p>

        <div class="navigation-buttons">
          <ion-button
            expand="block"
            color="primary"
            @click="navigateToPlayer"
            class="nav-button"
          >
            <ion-icon
              :icon="musicalNotes"
              size="large"
              class="nav-icon"
            ></ion-icon>

            Player
          </ion-button>

          <ion-button
            expand="block"
            color="secondary"
            @click="navigateToSettings"
            class="nav-button"
          >
            <ion-icon :icon="settings" size="large" class="nav-icon"></ion-icon>
            Settings
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { musicalNotes, settings } from "ionicons/icons";

const router = useRouter();

const navigateToPlayer = () => {
  router.push("/player");
};

const navigateToSettings = () => {
  router.push("/settings");
};
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.navigation-buttons {
  margin-top: 40px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.nav-button {
  margin: 10px 0;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
}

.nav-icon {
  font-size: 24px;
  margin-right: 15px;
}
</style>
