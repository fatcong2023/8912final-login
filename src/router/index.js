import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegistrationPage from '../components/RegistrationPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/registerPage', component: RegistrationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating to: ${to.path}`);
    next();
  });

export default router;
