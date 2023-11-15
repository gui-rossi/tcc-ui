<template>
  <div style="display: flex; justify-content: center;">
    <div>
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 8px;">
        <button @click="requestImage">Request Image</button>
        <button style="margin-left: 8px" @click="requestInfo">Request Infos</button>
        <button id="show-modal" @click="showModal = true">Show Modal</button>
      </div>

      <div v-if="this.image">
        <img :src="image" alt="Requested Image" />
      </div>

      <div v-if="this.infos?.gps">
        <p>GPS Coordinates:
          <br> {{ this.infos.gps.split('|')[0] }}
          <br> {{ this.infos.gps.split('|')[1] }}
        </p>
      </div>

      <div v-if="this.infos?.battery">
        <p>Battery: {{ this.infos.battery }}</p>
      </div>

      <div v-if="this.infos?.powerSource">
        <p>Power Source: {{ this.infos.powerSource }}</p>
      </div>
    </div>
    <ul v-if="eventLogHistory?.length">
      <li v-for="eventLog in eventLogHistory" :key="eventLog.Id">
        <strong>LogType: </strong> {{ eventLog.logType }}
        <strong>Status: </strong> {{ this.systemStatus[eventLog.status] }}
        <strong v-if="eventLog.value?.length">Value: </strong> {{ eventLog.value }}
        <strong>Date: </strong> {{ eventLog.timeStamp }}
      </li>
    </ul>
  </div>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modalComp :show="this.showModal" :myValue="'TESTE'" @close="showModal = false">
      <template #header>
        <h3>custom header</h3>
      </template>
    </modalComp>
  </Teleport>

</template>
  
<script>
/* eslint-disable */
import axios from '../axios';
import { ref } from 'vue'
import ModalComp  from './ModalComp.vue'

export default {
  components: {
      ModalComp,
    },
  props: {
    infos: {
      type: Array,
      required: false,
    },
    image: {
      type: String,
    },
  },
  mounted: async function () {
    await this.loadData();
  },
  data() {
    return {
      eventLogHistory: null,
      systemStatus: [
        'Waiting',
        'Executed',
        'Completed',
        'Error'
      ],
      showModal: ref(false),
    };
  },
  methods: {
    async loadData() {
      try {
        const data = await axios.get('/Event/GetHistory');
        this.eventLogHistory = data.data.slice(0, 15);
      } catch (error) {
        console.error(error);
      }
    },
    async requestImage() {
      try {
        await axios.get('/Event/RequestImage');
      } catch (error) {
        console.error(error);
      }
    },
    async requestInfo() {
      try {
        await axios.get('/Event/RequestInfos');
      } catch (error) {
        console.error(error);
      }
    },
    getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        return reader.result;
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  },
};
</script>

<style>
img {
  max-width: 100%;
}

.row {
  margin-bottom: 4px;
}
</style>