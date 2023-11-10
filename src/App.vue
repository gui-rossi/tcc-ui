<template>
  <div class="square">
    <h1 class="title-header">{{ this.currentPage == 'first' ? "Configs Page" : "Events Page" }}</h1>
    <div v-if="currentPage === 'first'">
      <ConfigsPage />
    </div>
    <div v-else-if="currentPage === 'second'">
      <EventsPage :infos="eventsInfo" :image="eventsImage"/>
    </div>
    <div class="buttons-switch">
      <button class="config-page-button btn" :class="this.btnConfig" @click="setCurrentPage('first')">Configs</button>
      <button class="btn" :class="this.btnEvent" @click="setCurrentPage('second')">Events</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ConfigsPage from './components/ConfigsPage.vue'
import EventsPage from './components/EventsPage.vue'
import * as signalR from '@microsoft/signalr';
import url from './backendUrl';

let connection = new signalR.HubConnectionBuilder().withUrl(url.signalR).build();

export default {
  name: 'App',
  components: {
    ConfigsPage,
    EventsPage
  },
  data() {
    return {
      currentPage: 'first',
      pageTitle: 'Configs',

      btnConfig: "btn-configs",
      btnEvent: "",

      eventsInfo: null,
      eventsImage: null,
    };
  },
  mounted: async function () {
    connection.start();
    connection.on("ReceiveImage", data => { this.eventsImage = data });
    connection.on("ReceiveInfos", data => { this.eventsInfo = data });
  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
      if (page == 'first') {
        this.btnConfig = "btn-configs";
        this.btnEvent = "";
      }else {
        this.btnEvent = "btn-events";
        this.btnConfig = "";
      }
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.title-header {
  display: flex;
  justify-content: center;
}

.buttons-switch {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    margin-left: 4px;
    margin-right: 4px;
}

.btn {
  width: 100%;
  height: 40px;
  background: unset;
  border: unset;
}

.btn-configs, .btn-events {
  border-left: unset;
  border-top: unset;
  border-right: unset;
  border-bottom: 2px black solid;
}

.square {
  background-color: floralwhite;
  border: 2px red solid;
  border-radius: 8px;
  width: 100%;
  padding-top: 12px;
}

.config-page-button {
}

</style>