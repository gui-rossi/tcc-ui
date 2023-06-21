<template>
  <div>
    <div>
      <button @click="requestImage">Request Image</button>
      <button @click="requestInfo">Request Infos</button>

      <div v-if="this.image">
          <img src="../assets/00-06-54.jpg" alt="Requested Image" />
      </div>
  
      <div v-if="this.infos?.gps">
          <p>GPS Coordinates: {{ this.infos.gps }}</p>
      </div>
  
      <div v-if="this.infos?.battery">
          <p>Battery: {{ this.infos.battery }}</p>
          <p>Gps: {{ this.infos.gps }}</p>
      </div>
    </div>
    <ul v-if="eventLogHistory?.length">
      <li v-for="eventLog in eventLogHistory" :key="eventLog.Id">
        {{ "LogType: " + eventLog.LogType + "Status: " + eventLog.Status + "Value: " + eventLog.Value + "Date: " + eventLog.TimeStamp }}
      </li>
    </ul>
  </div>
</template>
  
<script>
/* eslint-disable */
  import axios from '../axios';

  export default {
    props: {
        infos: {
            type: Array,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
    },
    mounted: async function () {
      await this.loadData();
    },
    data() {
        return {
          eventLogHistory: null,
        };
    },
    methods: {
      async loadData() {
        try {
          const data = await axios.get('/Event/GetHistory');
          this.eventLogHistory = data;
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
    },
  };
</script>

<style>
img {
    max-width:100%;
}

.row {
  margin-bottom: 4px;
}
</style>