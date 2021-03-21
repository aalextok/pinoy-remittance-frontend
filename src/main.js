import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import 'bulma';
import '@fortawesome/fontawesome-free/css/all.css';

const routes = [
  { 
    name: 'home',
    path: '/',
    component: () => import('./components/Home.vue'),
  },
  { 
    name: 'login',
    path: '/login',
    component: () => import('./components/Login.vue'),
  },
  {
    name: 'transaction',
    path: '/transaction/:id',
    component: () => import('./components/Transaction.vue'),
    props: true,
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('./components/Dashboard.vue'),
    beforeEnter: (to) => {
      const user = JSON.parse(localStorage.getItem('remittance-user'));
      if (!user || !user.is_admin) {
        return '/login';
      }
    }
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);
app.use(router);

app.mount('#app');
