import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/LoginView.vue'
import SignUpView from '../pages/SignUpView.vue'
import RecoverPasswordView from '../pages/RecoverPasswordView.vue'
import VerifyEmailView from '../pages/VerifyEmailView.vue'
import EmailSentView from '@/pages/EmailSentView.vue'
import DashboardView from '@/pages/DashboardView.vue'
import ProfilePageView from '@/pages/ProfilePageView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/recover',
    name: 'recover',
    component: RecoverPasswordView
  },
  {
    path: '/verify',
    name: 'verify',
    component: VerifyEmailView
  },
  {
  path: '/email-sent',
  name: 'email-sent',
  component: EmailSentView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePageView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
