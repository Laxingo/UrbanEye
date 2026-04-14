<template>
  <div class="dashboard">
    <Sidebar />

    <div class="main">
      <Navbar @open-new-event="showNewEvent = true" />

      <div class="content">
        <!-- MAP AREA -->
        <div class="map-area">
          <div id="map" class="map-container"></div>
        </div>

        <!-- EVENTS PANEL -->
        <aside class="events-panel">
          <h2 class="panel-title">Recent Events</h2>

          <div class="events-list">
            <EventCard
              v-for="event in events"
              :key="event.id"
              v-bind="event"
              @click="focusEvent(event)"
              class="event-clickable"
            />
          </div>
        </aside>
      </div>
    </div>

    <!-- NEW EVENT MODAL -->
    <NewEventForm
      v-if="showNewEvent"
      @close="showNewEvent = false"
      @submit="createEvent"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import EventCard from '@/components/EventCard.vue'
import NewEventForm from '@/components/NewEventForm.vue'

/* MODAL STATE */
const showNewEvent = ref(false)

/* EVENTS */
const events = ref([
  {
    id: 1,
    title: 'Pothole on Santa Catarina Street',
    category: 'Infrastructure',
    location: 'Rua de Santa Catarina, Porto',
    coords: [41.1487, -8.6070]
  },
  {
    id: 2,
    title: 'Traffic Light Malfunction at Glicínias Roundabout',
    category: 'Traffic',
    location: 'Rotunda do Glicínias, Aveiro',
    coords: [40.6405, -8.6538]
  },
  {
    id: 3,
    title: 'Overflowing Trash Container',
    category: 'Environment',
    location: 'Avenida da Liberdade, Lisbon',
    coords: [38.7369, -9.1427]
  },
  {
    id: 4,
    title: 'Nighttime Noise Complaint',
    category: 'Security',
    location: 'Historic Center, Braga',
    coords: [41.5454, -8.4265]
  },
  {
    id: 5,
    title: 'Broken Street Light',
    category: 'Infrastructure',
    location: 'Rua da Sofia, Coimbra',
    coords: [40.2056, -8.4196]
  }
])

/* CATEGORY COLORS */
const categoryColors = {
  Infrastructure: '#2D9CDB',
  Traffic: '#F2C94C',
  Environment: '#27AE60',
  Security: '#EB5757',
  Default: '#BB6BD9'
}

let map
let markerCluster
const markerRefs = ref({})

/* ⭐ INLINE SVG PIN — bigger (26px) */
function createColoredIcon(color) {
  const svg = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
    </svg>
  `

  return L.divIcon({
    className: 'pin-wrapper',
    html: `<div class="pin" style="color:${color}">${svg}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26]
  })
}

onMounted(() => {
  map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView([39.5, -8.0], 7)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerCluster = L.markerClusterGroup()
  map.addLayer(markerCluster)

  events.value.forEach(event => {
    const color = categoryColors[event.category] || categoryColors.Default

    const marker = L.marker(event.coords, {
      icon: createColoredIcon(color)
    })

    marker.bindPopup(`
      <strong>${event.title}</strong><br>
      ${event.location}<br>
      <em>${event.category}</em>
    `)

    markerCluster.addLayer(marker)
    markerRefs.value[event.id] = marker
  })
})

/* FOCUS + BOUNCE */
function focusEvent(event) {
  const marker = markerRefs.value[event.id]
  if (!marker) return

  map.setView(event.coords, 15, { animate: true })
  marker.openPopup()

  const el = marker.getElement()
  if (el) {
    el.classList.add('marker-bounce')
    setTimeout(() => el.classList.remove('marker-bounce'), 600)
  }
}

/* CREATE EVENT FROM MODAL */
function createEvent(data) {
  console.log("New event created:", data)
  showNewEvent.value = false
}
</script>

<style scoped>
/* INLINE SVG PIN */
.pin-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin svg {
  width: 26px;
  height: 26px;
  filter: drop-shadow(0 0 5px currentColor);
}

/* BOUNCE ANIMATION */
.marker-bounce {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
  60% { transform: translateY(0); }
  80% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}

/* LAYOUT */
.dashboard {
  display: flex;
  height: 100vh;
  background: #000;
  color: #fff;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.map-area {
  flex: 2;
  background: #0d0d0d;
  border-right: 1px solid #2a2a2a;
}

.map-container {
  width: 100%;
  height: 100%;
}

.events-panel {
  flex: 1;
  background: #0d0d0d;
  padding: 20px;
  overflow-y: auto;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-clickable {
  cursor: pointer;
}

/* CUSTOM SCROLLBAR — premium dark UI */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0d0d0d;
}

::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3a3a3a;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a #0d0d0d;
}

</style>
