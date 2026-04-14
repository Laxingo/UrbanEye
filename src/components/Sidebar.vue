<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="brand">
      <img src="/src/images/logo.png" alt="UrbanEye logo" class="logo" />
    </div>

    <!-- Main Menu -->
    <nav class="menu">
      <RouterLink
        v-for="item in mainMenu"
        :key="item.label"
        :to="item.path"
        class="menu-item"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" class="icon" />
        <span class="label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom Menu -->
    <nav class="menu bottom-menu">
      <RouterLink
        v-for="item in bottomMenu"
        :key="item.label"
        :to="item.path"
        class="menu-item"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" class="icon" />
        <span class="label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

import {
  HomeIcon,
  MapPinIcon,
  ArrowRightCircleIcon,
  UsersIcon,
  FolderIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const mainMenu = [
  { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { label: 'Events', path: '/events', icon: MapPinIcon },
  { label: 'Forwardings', path: '/forwardings', icon: ArrowRightCircleIcon },
  { label: 'Teams', path: '/teams', icon: UsersIcon },
  { label: 'Categories', path: '/categories', icon: FolderIcon }
]

const bottomMenu = [
  { label: 'Logout', path: '/logout', icon: ArrowLeftOnRectangleIcon }
]
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
  margin: 0;
  padding: 0;
}

.logo {
  width: 120px;
  height: auto;
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
