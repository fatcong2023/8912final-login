import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegistrationPage from '../components/RegistrationPage.vue';
import AdminPage from '../components/AdminPage.vue';
import SchedulingPage from '../components/SchedulingPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/registerPage', component: RegistrationPage },
  { path: '/admin', component: AdminPage },
  { path: '/schedule', component: SchedulingPage },
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