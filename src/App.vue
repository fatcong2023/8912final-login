<template>
  <img alt="Vue logo" src="./assets/images.jpg">
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<!-- <template>
  <img alt="Vue logo" src="./assets/images.jpg">
  <LoginPage msg="Welcome to Your Vue.js App"/>
  <RegistrationPage />
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import LoginPage from './components/LoginPage.vue'
// import RegistrationPage from './components/RegistrationPage.vue'

export default {
  name: 'App',
  components: {
    LoginPage,
    // RegistrationPage,
  }
}
</script> -->

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
