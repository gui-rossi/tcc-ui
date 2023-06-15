<template>
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
    data() {
        return {
          
        };
    },
    methods: {
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
</style>