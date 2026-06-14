<template>
  <aside class="sidebar">

    <!-- LOGO -->
    <div class="brand">
      <img src="/src/images/logo.png" alt="UrbanEye logo" class="logo" />
    </div>

    <!-- MENU -->
    <nav class="menu">
      <RouterLink
        :to="'/dashboard'"
        class="menu-item"
        :class="{ active: route.path === '/dashboard' }"
      >
        <HomeIcon class="icon" />
        <span class="label">Dashboard</span>
      </RouterLink>

      <template v-for="item in menuItems" :key="item.label">
  <RouterLink
    v-if="canSee(item)"
    :to="item.path"
    class="menu-item"
    :class="{ active: route.path === item.path }"
  >
    <component :is="item.icon" class="icon" />
    <span class="label">{{ item.label }}</span>
  </RouterLink>
</template>
    </nav>

    <!-- LOGOUT -->
    <nav class="menu bottom-menu">
      <div class="menu-item" @click="handleLogout">
        <ArrowLeftOnRectangleIcon class="icon" />
        <span class="label">Logout</span>
      </div>
    </nav>

  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout as logoutAuth } from "@/auth/auth"

import {
  HomeIcon,
  ArrowRightCircleIcon,
  UsersIcon,
  FolderIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const role = ref(null)

onMounted(() => {
  const session = JSON.parse(localStorage.getItem("session"))
  role.value = session?.role || null
})

const menuItems = [
  {
    label: "Forwardings",
    path: "/forwardings",
    icon: ArrowRightCircleIcon,
    roles: ["moderador", "gestor_municipal", "tecnico"]
  },
  {
    label: "Teams",
    path: "/teams",
    icon: UsersIcon,
    roles: ["moderador", "gestor_municipal", "tecnico"]
  },
  {
    label: "Categories",
    path: "/categories",
    icon: FolderIcon,
    roles: ["gestor_municipal"]
  }
]

// Mostra cada opção apenas aos tipos de utilizador permitidos.
function canSee(item) {
  return item.roles.includes(role.value)
}

// Termina a sessão e volta ao login.
function handleLogout() {
  logoutAuth()
  router.push("/")
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #0d0d0d;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-right: 1px solid #2a2a2a;
}

/* LOGO */
.brand {
  display: flex;
  justify-content: center;
}

.logo {
  width: 120px;
  opacity: 0.95;
  transition: transform 0.25s ease;
}

.logo:hover {
  transform: scale(1.03);
}

/* MENU */
.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 28px;
}

.bottom-menu {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #2a2a2a;
}

/* MENU ITEM */
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #b5b5b5;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.2s ease;
}

.menu-item:hover {
  background: #111;
  color: #fff;
  transform: translateX(6px);
}

.menu-item.active {
  background: #111;
  color: #2d9cdb;
}

/* ICON */
.icon {
  width: 20px;
  height: 20px;
}
</style>
