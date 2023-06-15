<template>
  <div class="square">
    <h2>{{ pageTitle }}</h2>
    <div v-if="currentPage === 'first'">
      <ConfigsPage />
    </div>
    <div v-else-if="currentPage === 'second'">
      <EventsPage :infos="eventsInfo" :image="eventsImage"/>
    </div>
    <div class="buttons-switch">
      <button class="config-page-button" @click="setCurrentPage('first')">Configs Page</button>
      <button @click="setCurrentPage('second')">Events Page</button>
    </div>
  </div>
</template>


<script>
import ConfigsPage from './components/ConfigsPage.vue'
import EventsPage from './components/EventsPage.vue'
import * as signalR from '@microsoft/signalr';

let connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5001/ChatHub").build();

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

      eventsInfo: null,
      eventsImage: null,
    };
  },
  mounted: async function () {
    // connection.on("ReceiveMessage", data => { console.log(data); });
    connection.on("ReceiveImage", data => { this.eventsImage = data });
    connection.on("ReceiveInfos", data => { this.eventsInfo = data });

    // connection.start().then(() => connection.invoke("SendMessage", "Gui",  "Hello"));
  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons-switch {
    margin-top: 16px;
    margin-bottom: 16px;
}
.square {
  border: 2px black solid;
  width: 30%;
}

.config-page-button {
  margin-right: 16px;
}

</style>