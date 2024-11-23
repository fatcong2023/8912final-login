<template>
  <div class="registration-container">
    <h2>Registration</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          v-model="firstName"
          placeholder="Enter your first name"
          required
        />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          v-model="lastName"
          placeholder="Enter your last name"
          required
        />
      </div>
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
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          v-model="phone"
          placeholder="Enter your phone number"
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "RegistrationPage",
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
    };
  },
  methods: {
    async handleSubmit() {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phone,
        username: this.username,
      };

      try {
        const response = await fetch('https://8912final-login-java.azurewebsites.net/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.text();
        console.log('Success:', data);
        alert('Registration successful!');
        this.$router.push('/');
      } catch (error) {
        console.error('Error:', error);
        alert('Registration failed!');
      }
    },
  },
};
</script>

<style scoped>
.registration-container {
  max-width: 400px;
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
input[type="password"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>