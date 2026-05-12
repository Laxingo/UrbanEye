<template>
  <header class="navbar" :class="{ full: isUser }">

    <!-- LEFT SECTION -->
    <div class="left">
      <template v-if="!isUser">
        <button class="new-event" @click="$emit('open-new-event')">
          <PlusIcon class="icon-btn" />
          New Event
        </button>

        <div class="search-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            @input="$emit('search', searchQuery)"
          />
        </div>
      </template>
    </div>

    <div class="center"></div>

    <!-- RIGHT SECTION -->
    <div class="right">
      <div class="notif-wrapper">
        <button class="icon-button" @click="toggleNotifications">
          <BellIcon class="icon" />
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>

        <div v-if="showNotifications" class="notif-popup">
          <div class="notif-header">
            <h3>Notifications</h3>
            <div class="notif-actions">
              <button class="mark-read" @click="markAllRead">Mark all as read</button>
              <button class="clear-all" @click="clearAllNotifications">Clear all</button>
            </div>
          </div>

          <div v-if="notifications.length === 0" class="notif-empty">
            No notifications
          </div>

          <div v-else class="notif-list">
            <div
              v-for="(notif, index) in notifications"
              :key="index"
              class="notif-item"
              :class="{ unread: notif.unread }"
            >
              <div class="notif-text">
                <p>{{ notif.text }}</p>
                <small>{{ notif.time }}</small>
              </div>

              <button class="delete-btn" @click="deleteNotification(index)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <RouterLink to="/profile" class="user-icon no-underline">
        <img
          v-if="avatar"
          :src="avatar"
          alt="avatar"
          class="avatar-img"
        />
        <span v-else>U</span>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MagnifyingGlassIcon, BellIcon, PlusIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const props = defineProps({
  isUser: { type: Boolean, default: false }
})

const searchQuery = ref("")
const showNotifications = ref(false)
const avatar = ref("")

onMounted(() => {
  const session = JSON.parse(localStorage.getItem("session"))
  avatar.value = session?.photo || "https://i.pravatar.cc/150?img=12"
})

window.addEventListener("storage", () => {
  const session = JSON.parse(localStorage.getItem("session"))
  avatar.value = session?.photo || "https://i.pravatar.cc/150?img=12"
})

const notifications = ref([
  { text: "New event reported in Porto", time: "2 min ago", unread: true },
  { text: "Traffic alert updated", time: "10 min ago", unread: true },
  { text: "System check completed", time: "1 hour ago", unread: false }
])

const unreadCount = computed(() =>
  notifications.value.filter(n => n.unread).length
)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAllRead() {
  notifications.value.forEach(n => n.unread = false)
}

function deleteNotification(index) {
  notifications.value.splice(index, 1)
}

function clearAllNotifications() {
  notifications.value = []
}
</script>

<style scoped>
/* NAVBAR GRID LAYOUT */
.navbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: #0d0d0d;
  color: #fff;
  padding: 14px 22px;
  border-bottom: 1px solid #2a2a2a;
  height: 60px;
}

/* LEFT COLUMN */
.left {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* CENTER COLUMN */
.center {
  justify-self: center;
}

/* RIGHT COLUMN */
.right {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-self: end;
}

/* NEW EVENT BUTTON */
.new-event {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2d9cdb;
  border: none;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.2s ease;
}

.new-event:hover {
  background: #38a9f0;
  transform: translateY(-2px);
}

.icon-btn {
  width: 16px;
  height: 16px;
}

/* SEARCH BAR */
.search-wrapper {
  position: relative;
}

.search-wrapper input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 8px 34px 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  width: 200px;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.search-wrapper input:focus {
  border-color: #2d9cdb;
  background: #0f0f0f;
  outline: none;
}

.search-icon {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 10px;
  top: 8px;
  opacity: 0.6;
}

/* NOTIFICATIONS */
.notif-wrapper {
  position: relative;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.25s ease, transform 0.2s ease;
  position: relative;
}

.icon-button:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #eb5757;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 999px;
  min-width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* POPUP MAIOR E MAIS CONFORTÁVEL */
.notif-popup {
  position: absolute;
  top: 50px;
  right: 0;
  width: 260px; /* AUMENTADO */
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 14px; /* mais espaço */
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
  animation: fadeSlide 0.25s ease;
  z-index: 1000;
}

/* HEADER */
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h3 {
  font-size: 15px;
  margin: 0;
}

.notif-actions {
  display: flex;
  gap: 8px; /* MAIS ESPAÇO */
}

/* BOTÕES DE AÇÃO MENOS COMPACTOS */
.mark-read,
.clear-all {
  background: none;
  border: none;
  color: #2d9cdb;
  font-size: 12px; /* maior */
  cursor: pointer;
  padding: 4px 6px; /* mais espaço */
  border-radius: 4px;
  transition: background 0.2s ease;
}

.mark-read:hover,
.clear-all:hover {
  background: #1a1a1a;
}

/* LISTA */
.notif-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ITEM */
.notif-item {
  background: #1a1a1a;
  padding: 10px; /* mais espaço */
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.notif-item.unread {
  border-left: 3px solid #2d9cdb;
}

/* TEXTO */
.notif-text p {
  font-size: 13px;
  margin: 0;
}

.notif-text small {
  font-size: 10px;
  opacity: 0.6;
}

/* DELETE BUTTON */
.delete-btn {
  background: none;
  border: none;
  color: #777;
  font-size: 12px;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 4px;
}

.delete-btn:hover {
  color: #fff;
  background: #333;
}

/* EMPTY STATE — MAIS PEQUENO */
.notif-empty {
  padding: 10px;
  text-align: center;
  opacity: 0.6;
  font-size: 12px; /* reduzido */
}

/* ANIMATION */
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* USER ICON */
.user-icon {
  background: #2d9cdb;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.no-underline {
  text-decoration: none;
}

.navbar.full {
  grid-template-columns: 1fr 1fr 1fr;
  margin-left: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

</style>
