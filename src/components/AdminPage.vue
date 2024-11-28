<template>
    <div class="admin-container">
      <h2>Admin Dashboard</h2>
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
      </div>
  
      <!-- Add chart container -->
      <div class="chart-container" v-if="inventoryData.length">
        <div class="chart">
          <h3>Blood Inventory for {{ selectedCity }}, {{ selectedState }}</h3>
          <!-- <div class="bar-chart">
            <div 
              v-for="item in inventoryData" 
              :key="`${item.ABO}${item.Rh}`" 
              class="bar-group"
            >
              <div 
                class="bar" 
                :style="{ height: `${(item.hundredccCount / maxCount) * 200}px` }"
              >
                <div class="bar-value">{{ item.hundredccCount }}</div>
              </div>
              <div class="bar-label">{{ item.ABO }}{{ item.Rh }}</div>
            </div>
          </div>
          <div class="chart-legend">
            <div>Blood Type</div>
            <div>Units Available (100cc)</div>
          </div> -->
        </div>
        <div class="table-container">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Rh Factor</th>
                <th>Units (100cc)</th>
                <th>Bank Number</th>
                <th>Universal Bank Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in inventoryData" :key="`${item.ABO}${item.Rh}${item.BankNumber}`">
                <td>{{ item.ABO }}</td>
                <td>{{ item.Rh }}</td>
                <td>
                  <input 
                    type="number" 
                    v-model.number="inventoryData[index].hundredccCount"
                    @input="handleInputChange(index)"
                    class="unit-input"
                    min="0"
                  >
                </td>
                <td>{{ item.BankNumber }}</td>
                <td>{{ item.universalBankNumber }}</td>
                <td>{{ item.Address }}</td>
              </tr>
            </tbody>
          </table>
          <button 
            class="submit-button" 
            :disabled="!isModified" 
            @click="handleSubmit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AdminPage',
    data() {
      return {
        stateData: [],
        states: [],
        selectedState: '',
        selectedCity: '',
        citiesForState: [],
        inventoryData: [],
        originalData: [],
        isModified: false
      };
    },
    computed: {
      maxCount() {
        return Math.max(...this.inventoryData.map(item => item.hundredccCount), 0);
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
        this.inventoryData = [];
        this.isModified = false;
        if (this.selectedState) {
          const stateInfo = this.stateData.find(item => item.state === this.selectedState);
          this.citiesForState = stateInfo ? stateInfo.city : [];
        } else {
          this.citiesForState = [];
        }
      },
      async handleCityChange() {
        if (this.selectedCity && this.selectedState) {
          try {
            const response = await axios.post('https://8912final-inventory-server.azurewebsites.net/api/getData/', {
              state: this.selectedState,
              city: this.selectedCity
            });
            this.inventoryData = response.data;
            this.originalData = JSON.parse(JSON.stringify(response.data)); // Deep copy for comparison
            this.isModified = false;
          } catch (error) {
            console.error('Error fetching inventory data:', error);
          }
        }
      },
      handleInputChange(index) {
        // Compare with original data to check if any values have changed
        this.isModified = this.inventoryData[index].hundredccCount !== this.originalData[index].hundredccCount;
      },
      async handleSubmit() {
      // Find changed records
      const changedRecords = this.inventoryData.filter((item, index) => {
        return item.hundredccCount !== this.originalData[index].hundredccCount;
      });

      // Send update requests for changed records
      try {
        for (const record of changedRecords) {
          await axios.put('https://8912final-inventory-server.azurewebsites.net/api/updateCount', {
            universalBankNumber: record.universalBankNumber,
            ABO: record.ABO,
            Rh: record.Rh,
            hundredccCount: record.hundredccCount
          });
        }
        // Update original data after successful submission
        this.originalData = JSON.parse(JSON.stringify(this.inventoryData));
        this.isModified = false;
        alert('Updates submitted successfully!');
      } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Error updating inventory. Please try again.');
      }
    }
    }
  };
  </script>
  
  <style scoped>
  .admin-container {
    max-width: 800px;
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
  }
  
  .dropdown {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .chart-container {
    margin-top: 40px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  
  .chart {
    text-align: center;
  }
  
  .bar-chart {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 250px;
    gap: 20px;
    margin: 20px 0;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
  }
  
  .bar {
    width: 40px;
    background-color: #ef4444;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
    position: relative;
    min-height: 1px;
  }
  
  .bar-value {
    position: absolute;
    top: -25px;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
  
  .bar-label {
    margin-top: 8px;
    font-size: 14px;
  }
  
  .chart-legend {
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    color: #666;
    font-size: 14px;
  }
  
  .table-container {
    position: relative;
  }
  
  .submit-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>