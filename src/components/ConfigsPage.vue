<template>
    <div class="container" v-if="this.configs">
      <div>
        <div class="row">
          <div class="light-time">Active light time window:</div>
          <div>
            <span>Start Time:</span>
            <button @click="selectStartTime">{{ startTime }}</button>
            <span class="span-2">End Time:</span>
            <button @click="selectEndTime">{{ endTime }}</button>
          </div>
        </div>
        <div class="row">
          <div class="light-time">Detection time window:</div>
          <div>
            <span>Start Time:</span>
            <button @click="selectStartDetectionTime">{{ startTimeDetection }}</button>
            <span class="span-2">End Time:</span>
            <button @click="selectEndDetectionTime">{{ endTimeDetection }}</button>
          </div>
        </div>
        <div class="row">
          <input type="checkbox" id="detectTruck" v-model="detectTruck">
          <label for="detectTruck">Detect Truck</label>
        </div>
        <div class="row">
          <input type="checkbox" id="detectPerson" v-model="detectPerson">
          <label for="detectPerson">Detect Person</label>
        </div>
        <div class="row">
          <input type="checkbox" id="soundAlarm" v-model="soundAlarm">
          <label for="soundAlarm">Sound Alarm on Person Detection</label>
        </div>
        <div class="row">
          <input type="checkbox" id="lightOn" v-model="isLightOn">
          <label for="lightOn">Light Status</label>
        </div>
        <div class="row">
          <input type="checkbox" id="alarmPlaying" v-model="isAlarmPlaying">
          <label for="alarmPlaying">Alarm Status</label>
        </div>
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
        isLightOn: false,
        isAlarmPlaying: false,
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        startTimeDetection: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTimeDetection: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          } else if (config.configLabel === 'DetectionTime'){
            this.startTimeDetection = new Date(config.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.endTimeDetection = new Date(config.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (config.configLabel === 'IsLightOn') {
            this.isLightOn = config.active;
          } else if (config.configLabel === 'IsAlarmPlaying') {
            this.isAlarmPlaying = config.active;
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
          } else if (config.configLabel === 'SoundAlarmOnPersonDetection') {
            config.startTime = this.startTimeDetection;
            config.endTime = this.endTimeDetection; 
          } else if (config.configLabel === 'IsLightOn') {
            config.active = this.isLightOn;
          } else if (config.configLabel === 'IsAlarmPlaying') {
            config.active = this.isAlarmPlaying;
          }
        })

        const start = this.parseTimeString(this.startTime);
        const end = this.parseTimeString(this.endTime);

        const startDet = this.parseTimeString(this.startTimeDetection);
        const endDet = this.parseTimeString(this.endTimeDetection);
        
        this.configs[0].startTime = new Date(1900, 1, 1, start.hours, start.minutes); 
        this.configs[0].endTime = new Date(1900, 1, 1, end.hours, end.minutes);

        this.configs[4].startTime = new Date(1900, 1, 1, startDet.hours, startDet.minutes); 
        this.configs[4].endTime = new Date(1900, 1, 1, endDet.hours, endDet.minutes);

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
      selectStartDetectionTime() {
        const picked = window.prompt('Select Start Time (HH:mm)', this.startTimeDetection);
        if (picked) {
          const [hours, minutes] = picked.split(':');
          const isValidTime = this.isValidTime(hours, minutes);
          if (isValidTime) {
            this.startTimeDetection = picked;
          } else {
            window.alert('Invalid time! Please enter a valid time in the format HH:mm.');
          }
        }
      },
      selectEndDetectionTime() {
        const picked = window.prompt('Select End Time (HH:mm)', this.endTimeDetection);
        if (picked) {
          const [hours, minutes] = picked.split(':');
          const isValidTime = this.isValidTime(hours, minutes);
          if (isValidTime) {
            this.endTimeDetection = picked;
          } else {
            window.alert('Invalid time! Please enter a valid time in the format HH:mm.');
          }
        }
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

<style>
.row {
  margin-bottom: 8px;
}

.container {
  display: flex;
  justify-content: space-around;
}

.span-2{
  margin-left: 16px;
}
.light-time {
  margin-bottom: 4px;
}

</style>
  