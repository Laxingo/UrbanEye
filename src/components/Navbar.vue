<template>
  <header class="navbar">

    <!-- LEFT SECTION (kept for layout, content hidden on profile) -->
    <div class="left">
      <template v-if="route.path !== '/profile'">
        <button class="new-event" @click="$emit('open-new-event')">
          <PlusIcon class="icon-btn" />
          New Event
        </button>

        <div class="search-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </template>
    </div>

    <!-- CENTER SPACER -->
    <div class="center"></div>

    <!-- RIGHT SECTION (always visible) -->
    <div class="right">
      <div class="notif-wrapper">
        <button class="icon-button" @click="toggleNotifications">
          <BellIcon class="icon" />
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>

        <div v-if="showNotifications" class="notif-popup">
          <div class="notif-header">
            <h3>Notifications</h3>
            <button class="mark-read" @click="markAllRead">Mark all as read</button>
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

      <RouterLink to="/profile" class="user-icon no-underline">U</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { MagnifyingGlassIcon, BellIcon, PlusIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const showNotifications = ref(false)

const notifications = ref([
  { text: "New event reported in Porto", time: "2 min ago", unread: true },
  { text: "Traffic alert updated", time: "10 min ago", unread: true },
  { text: "System check completed", time: "1 hour ago", unread: false }
])

const unreadCount = ref(notifications.value.filter(n => n.unread).length)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAllRead() {
  notifications.value.forEach(n => n.unread = false)
  unreadCount.value = 0
}

function deleteNotification(index) {
  const wasUnread = notifications.value[index].unread
  notifications.value.splice(index, 1)

  if (wasUnread) {
    unreadCount.value = notifications.value.filter(n => n.unread).length
  }
}
</script>

<style scoped>
/* NAVBAR GRID LAYOUT */
.navbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* left | center | right */
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

/* CENTER COLUMN (empty but keeps spacing) */
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

/* POPUP */
.notif-popup {
  position: absolute;
  top: 50px;
  right: 0;
  width: 240px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
  animation: fadeSlide 0.25s ease;
  z-index: 1000;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mark-read {
  background: none;
  border: none;
  color: #2d9cdb;
  font-size: 12px;
  cursor: pointer;
}

.notif-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notif-item {
  background: #1a1a1a;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.notif-item.unread {
  border-left: 3px solid #2d9cdb;
}

.notif-text {
  display: flex;
  flex-direction: column;
}

.delete-btn {
  background: none;
  border: none;
  color: #777;
  font-size: 12px;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.delete-btn:hover {
  color: #fff;
  background: #333;
}

.notif-empty {
  padding: 16px;
  text-align: center;
  opacity: 0.7;
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
</style>
