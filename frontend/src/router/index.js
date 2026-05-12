import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/LoginView.vue'
import SignUpView from '../pages/SignUpView.vue'
import RecoverPasswordView from '../pages/RecoverPasswordView.vue'
import VerifyEmailView from '../pages/VerifyEmailView.vue'
import EmailSentView from '@/pages/EmailSentView.vue'
import DashboardView from '@/pages/DashboardView.vue'
import ProfilePageView from '@/pages/ProfilePageView.vue'
import ForwardingView from '@/pages/ForwardingView.vue'
import TeamsView from '@/pages/TeamsView.vue'

// Função simples para verificar sessão
function isAuthenticated() {
  const session = JSON.parse(localStorage.getItem("session"))
  return session !== null
}

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignUpView },
  { path: '/recover', name: 'recover', component: RecoverPasswordView },
  { path: '/verify', name: 'verify', component: VerifyEmailView },
  { path: '/email-sent', name: 'email-sent', component: EmailSentView },

  // ROTAS PROTEGIDAS
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/forwardings',
    name: 'forwardings',
    component: ForwardingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/teams',
    name: 'teams',
    component: TeamsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- PROTEÇÃO DE ROTAS ---
router.beforeEach((to, from) => {
  const loggedIn = isAuthenticated()

  // Bloqueia rotas protegidas
  if (to.meta.requiresAuth && !loggedIn) {
    return '/'
  }

  // Evita que utilizadores autenticados voltem ao login/signup
  if ((to.path === '/' || to.path === '/signup') && loggedIn) {
    return '/dashboard'
  }

  // Caso contrário, deixa seguir
  return true
})

export default router
