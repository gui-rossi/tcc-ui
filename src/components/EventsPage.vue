<template>
  <div style="display: block;">
    <div>
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 1em; margin-top: 1em">
        <v-btn density="comfortable" @click="requestImage">Request Image</v-btn>
        <v-btn density="comfortable" style="margin-left: 8px" @click="requestInfo">Request Infos</v-btn>
        <!-- <v-btn id="show-modal" @click="showModal = true">Show Modal</v-btn> -->
      </div>

      <!-- <div v-if="this.image">
        <img :src="'data:image/png;base64,' + image" alt="Requested Image" />
      </div> -->

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
    <div style="margin-left: 2em; margin-right: 2em;">
      <h3> Last events: </h3>
      <v-list lines="two" density="compact" v-if="eventLogHistory?.length" item-props
        style="background-color: floralwhite">
        <v-list-item v-for="eventLog in eventLogHistory" :key="eventLog.Id">
          <v-list-item-title style="color: darkslategray;"><strong>{{ eventLog.logType }}</strong></v-list-item-title>

          <v-list-item-subtitle>
            <div v-if="eventLog.value">Value: {{ eventLog.value }}</div>
            <div>{{ formatDate(new Date(eventLog.timeStamp)) }}</div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <div v-else>
        <p>No events found</p>
      </div>
    </div>
  </div>

  <!-- Modal Component -->
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modalComp :show="this.showModal" :modalContent="this.modalContent" :modalImage="this.modalImage"
      @close="showModal = false">
      <template #header>
        <h3> {{ this.modalTitle }} </h3>
      </template>
    </modalComp>
  </Teleport>
</template>
  
<script>
/* eslint-disable */
import axios from '../axios';
import { ref } from 'vue'
import ModalComp from './ModalComp.vue'
import moment from 'moment'

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
    msg: {
      type: String,
    }
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
      modalTitle: ref('Teste')
    };
  },
  methods: {
    logMsg(msg) {
      console.log(msg);
    },
    openModal(type, data) {
      //// TODO: check data against script injection
      if (type == 'receiveImage') {
        this.modalTitle = 'Image Received';
        this.modalContent = null;
        this.modalImage = data;
      } else if (type == 'receiveInfos') {
        this.modalTitle = 'Infos Received';
        this.modalContent = data.gps.split("|")[0] + "<br>" + data.gps.split("|")[1] + "<br>Power Source: " + data.powerSource + "<br>Battery Level: " + data.battery;
        this.modalImage = null;
      } else if (type == 'fullMemory') {
        this.modalTitle = 'Alert!';
        this.modalContent = "Device memory is full!";
      } else if (type == 'cameraObstruction') {
        this.modalTitle = 'Alert!';
        this.modalContent = "Camera is obstructed!";
      } else if (type == 'powerLoss') {
        this.modalTitle = 'Alert!';
        this.modalContent = "Power loss identified!";
      }
      else if (type == 'gpsMovement') {
        this.modalTitle = 'Alert!';
        this.modalContent = "Device movement identified!";
      }
      else if (type == 'notifyTruck') {
        this.modalTitle = 'New Truck Detected';
        this.modalContent = null;
        this.modalImage = data;
      } else if (type == 'notifyPerson') {
        this.modalTitle = 'New Person Detected';
        this.modalContent = null;
        this.modalImage = data;
      }
      else {
        this.modalTitle = 'Alert!';
        this.modalContent = "Unknown notification";
      }

      this.showModal = true;
    },
    async loadData() {
      try {
        const data = await axios.get('/Event/GetHistory');
        this.eventLogHistory = data.data.slice(0, 7);
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY HH:mm')
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