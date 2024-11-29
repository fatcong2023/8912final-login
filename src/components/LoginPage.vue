<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <button @click="handleRegister" class="register-button">Register</button>
  </div>
</template>

<script>

import axios from 'axios';
export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
  if (this.username && this.password) {
    try {
      const response = await axios.post('https://8912final-login-java.azurewebsites.net/api/login', {
        username: this.username,
        password: this.password
      });

      if (response.status === 201) {
        this.$store.dispatch('setUsername', this.username);
        if (this.username.toLowerCase() === 'admin') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/schedule');
        }
      }
    } catch (error) {
      alert("Unauthorized: Invalid username or password");
      console.error('Login error:', error);
    }
  } else {
    alert("Please enter both username and password");
  }
},
    handleRegister() {
      console.log(this.$router);
      // this.$router.push({ path: "/registerPage" });
      this.$router.push({ path: "/registerPage" });
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"],
input[type="password"] {
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

button:hover {
  background-color: #0056b3;
}

.register-button {
  background-color: #28a745;
}

.register-button:hover {
  background-color: #218838;
}
</style>
