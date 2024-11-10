import Vue from 'vue';
import Router from 'vue-router';
import RegistrationPage from '@/components/RegistrationPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/registerPage',
      name: 'RegisterPage',
      component: RegistrationPage,
    },
    // other routes
  ],
});