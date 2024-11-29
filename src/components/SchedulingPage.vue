<template>
  <div class="scheduling-container">
    <h2 v-if="!appointmentDetails">Schedule an Appointment</h2>
    <h2 v-else>Appointment Receipt</h2>

    <div v-if="!appointmentDetails">
      <div class="dropdown-container">
        <div class="form-group">
          <label for="state">State:</label>
          <select 
            id="state" 
            v-model="selectedState" 
            @change="handleStateChange"
            class="dropdown"
          >
            <option value="">Select a State</option>
            <option v-for="state in states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="city">City:</label>
          <select 
            id="city" 
            v-model="selectedCity"
            @change="handleCityChange"
            class="dropdown"
            :disabled="!selectedState"
          >
            <option value="">Select a City</option>
            <option v-for="city in citiesForState" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="banks.length">
          <label for="bank">Bank:</label>
          <select 
            id="bank" 
            v-model="selectedBank"
            class="dropdown"
          >
            <option value="">Select a Bank</option>
            <option v-for="bank in banks" :key="bank.universalBankNumber" :value="bank.universalBankNumber">
              {{ bank.address }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="abo">ABO:</label>
        <input type="text" id="abo" v-model="abo" placeholder="Enter ABO type" />
      </div>

      <div class="form-group">
        <label for="rh">Rh:</label>
        <input type="text" id="rh" v-model="rh" placeholder="Enter Rh factor" />
      </div>

      <div class="form-group">
        <label for="date">Select Date:</label>
        <input type="date" id="date" v-model="selectedDate" @change="handleDateChange" />
      </div>

      <div class="form-group" v-if="availableTimeSlots.length">
        <label for="timeSlot">Available Time Slot:</label>
        <select id="timeSlot" v-model="selectedTimeSlot" class="dropdown">
          <option value="">Select a Time Slot</option>
          <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <button @click="handleSubmit" :disabled="!isFormValid" class="submit-button">
        Schedule Appointment
      </button>
    </div>

    <div v-else class="receipt-container">
      <h3>Appointment Scheduled Successfully!</h3>
      <p><strong>Appointment ID:</strong> {{ appointmentDetails.AppointmentID }}</p>
      <p><strong>Scheduled Date and Time:</strong> {{ appointmentDetails.ScheduledDateTime }}</p>
      <p><strong>Username:</strong> {{ appointmentDetails.Username }}</p>
      <p><strong>Universal Bank Number:</strong> {{ appointmentDetails.UniversalBankNumber }}</p>
      <p><strong>Notes:</strong> {{ appointmentDetails.Notes }}</p>
      <p><strong>Status:</strong> {{ appointmentDetails.Status }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'SchedulingPage',
  data() {
    return {
      stateData: [],
      states: [],
      selectedState: '',
      selectedCity: '',
      citiesForState: [],
      banks: [],
      selectedBank: '',
      abo: '',
      rh: '',
      selectedDate: '',
      availableTimeSlots: [],
      selectedTimeSlot: '',
      appointmentDetails: null
    };
  },
  computed: {
    ...mapGetters(['getUsername']),
    isFormValid() {
      console.log('Form Validity Check:', this.selectedState, this.selectedCity, this.selectedBank, this.selectedDate, this.selectedTimeSlot);
      return this.selectedState && this.selectedCity && this.selectedBank && this.selectedDate && this.selectedTimeSlot;
    }
  },
  async created() {
    try {
      const response = await axios.get('https://8912final-inventory-server.azurewebsites.net/api/getStates/');
      this.stateData = response.data;
      this.states = response.data.map(item => item.state);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  },
  methods: {
    handleStateChange() {
      this.selectedCity = '';
      this.citiesForState = [];
      this.banks = [];
      if (this.selectedState) {
        const stateInfo = this.stateData.find(item => item.state === this.selectedState);
        this.citiesForState = stateInfo ? stateInfo.city : [];
      }
    },
    async handleCityChange() {
      if (this.selectedCity && this.selectedState) {
        try {
          const response = await axios.post('https://8912final-inventory-server.azurewebsites.net/api/getData/', {
            state: this.selectedState,
            city: this.selectedCity
          });
          const data = response.data;
          const uniqueBanks = [];
          const addresses = new Set();

          data.forEach(item => {
            console.log("item: ", item);
            if (!addresses.has(item.Address)) {
              addresses.add(item.Address);
              uniqueBanks.push({
                address: item.Address,
                universalBankNumber: item.universalBankNumber
              });
            }
          });

          this.banks = uniqueBanks;
          console.log("Banks: ", this.banks);
        } catch (error) {
          console.error('Error fetching bank data:', error);
        }
      }
    },
    handleDateChange() {
      if (this.selectedDate) {
        this.availableTimeSlots = this.generateTimeSlots();
      }
    },
    generateTimeSlots() {
      const slots = [];
      const startTime = new Date();
      startTime.setHours(9, 0, 0); // 9:00 AM
      const endTime = new Date();
      endTime.setHours(17, 0, 0); // 5:00 PM

      while (startTime < endTime) {
        slots.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      return slots;
    },
    async handleSubmit() {
      try {
        const response = await axios.post('https://8912final-scheduling.azurewebsites.net/api/appointments', {
          ScheduledDateTime: `${this.selectedDate} ${this.selectedTimeSlot}`,
          Username: this.getUsername, // Use the username from Vuex
          UniversalBankNumber: this.selectedBank
        });
        this.appointmentDetails = response.data;
        console.log('Appointment Details:', this.appointmentDetails);
      } catch (error) {
        console.error('Error scheduling appointment:', error);
        alert('Error scheduling appointment. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.scheduling-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dropdown-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"],
input[type="date"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}

.receipt-container {
  text-align: left;
  margin-top: 20px;
}

.receipt-container p {
  margin: 5px 0;
}
</style>