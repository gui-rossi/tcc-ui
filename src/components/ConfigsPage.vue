<template>
    <div v-if="this.configs">
      <h2>Time Window Picker</h2>
      <div>
        <span>Start Time:</span>
        <button @click="selectStartTime">{{ startTime }}</button>
        <span>End Time:</span>
        <button @click="selectEndTime">{{ endTime }}</button>
      </div>
      <div>
        <input type="checkbox" id="detectTruck" v-model="detectTruck">
        <label for="detectTruck">Detect Truck</label>
      </div>
      <div>
        <input type="checkbox" id="detectPerson" v-model="detectPerson">
        <label for="detectPerson">Detect Person</label>
      </div>
      <div>
        <input type="checkbox" id="soundAlarm" v-model="soundAlarm">
        <label for="soundAlarm">Sound Alarm on Person Detection</label>
      </div>
      <button @click="saveConfig">Save</button>
    </div>
</template>
  
<script>
/* eslint-disable */
  import axios from '../axios';

  export default {
    data() {
      return {
        configs: null,
        ConfigEntity: {
          Id: 0,
          ConfigLabel: "",
          Active: false,
          StartTime: new Date(),
          EndTime: new Date(),
        },
        detectTruck: false,
        detectPerson: false,
        soundAlarm: false,
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    },
    mounted: async function () {
      await this.loadData();
    },
    methods: {
      async loadData () {
        const data = await this.fetchConfigs();
        this.configs = data;
        data.forEach(config => {
          if (config.configLabel === 'LightTime'){
            this.startTime = new Date(config.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.endTime = new Date(config.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (config.configLabel === 'DetectTruck') {
            this.detectTruck = config.active; 
          } else if (config.configLabel === 'DetectPerson') {
            this.detectPerson = config.active;
          } else if (config.configLabel === 'SoundAlarmOnPersonDetection') {
            this.soundAlarm = config.active;
          }
        })

      },
      async saveConfig () {
        this.configs.forEach(config => {
          if (config.configLabel === 'LightTime'){
            config.startTime = this.startTime;
            config.endTime = this.endTime; 
          } else if (config.configLabel === 'DetectTruck') {
            config.active = this.detectTruck; 
          } else if (config.configLabel === 'DetectPerson') {
            config.active = this.detectPerson; 
          } else if (config.configLabel === 'SoundAlarmOnPersonDetection') {
            config.active = this.soundAlarm; 
          }
        })

        const start = this.parseTimeString(this.configs[0].startTime);
        const end = this.parseTimeString(this.configs[0].endTime);

        this.configs[0].startTime = new Date(1900, 1, 1, start.hours, start.minutes); 
        this.configs[0].endTime = new Date(1900, 1, 1, end.hours, end.minutes);

        this.configs.forEach(config => {
          config.startTime = config.startTime.toString();
          config.endTime = config.endTime.toString(); 
        });
        
        await this.updateConfigs()
      },
      parseTimeString (timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return { hours, minutes };
      },
      async updateConfigs() {
        await axios.put('/Config/ChangeConfig', this.configs)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      },

      async fetchConfigs() {
        const response = await axios.get('/Config/FetchConfigs')
          .catch((error) => {
            console.error(error);
          });

        return response.data;
      },
      selectStartTime() {
        const picked = window.prompt('Select Start Time (HH:mm)', this.startTime);
        if (picked) {
          const [hours, minutes] = picked.split(':');
          const isValidTime = this.isValidTime(hours, minutes);
          if (isValidTime) {
            this.startTime = picked;
          } else {
            window.alert('Invalid time! Please enter a valid time in the format HH:mm.');
          }
        }
      },
      selectEndTime() {
        const picked = window.prompt('Select End Time (HH:mm)', this.endTime);
        if (picked) {
          const [hours, minutes] = picked.split(':');
          const isValidTime = this.isValidTime(hours, minutes);
          if (isValidTime) {
            this.endTime = picked;
          } else {
            window.alert('Invalid time! Please enter a valid time in the format HH:mm.');
          }
        }
      },
      isValidTime(hours, minutes) {
        const numericHours = parseInt(hours, 10);
        const numericMinutes = parseInt(minutes, 10);
        return (
          !isNaN(numericHours) &&
          !isNaN(numericMinutes) &&
          numericHours >= 0 &&
          numericHours <= 23 &&
          numericMinutes >= 0 &&
          numericMinutes <= 59
        );
      },
    }
  };
</script>
  