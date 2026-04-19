<template>
  <div class="dashboard">
    <Sidebar />

    <div class="main">
      <Navbar
        @open-new-event="showNewEvent = true"
        @search="searchEvents"
      />

      <div class="content">
        <!-- MAP -->
        <div class="map-area">
          <div id="map" class="map-container"></div>
        </div>

        <!-- EVENTS PANEL -->
        <aside class="events-panel">
          <h2 class="panel-title">List of Events</h2>

          <div class="events-list">
            <EventCard
              v-for="event in filteredEvents"
              :key="event.id"
              v-bind="event"
              @click="openEventDetails(event)"
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

    <!-- EVENT DETAILS MODAL -->
    <EventDetailsModal
      v-if="showEventDetails"
      :event="selectedEvent"
      @close="showEventDetails = false"
      @edit="openEditEvent"
      @delete="deleteEvent"
      @confirm="confirmEvent"
      @reject="rejectEvent"
      @forward="forwardEvent"
    />

    <!-- EDIT EVENT MODAL -->
    <EditEventModal
      v-if="showEditEvent"
      :event="selectedEvent"
      @close="showEditEvent = false"
      @save="saveEditedEvent"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import EventCard from '@/components/EventCard.vue'
import NewEventForm from '@/components/NewEventForm.vue'
import EventDetailsModal from '@/components/EventDetailModal.vue'
import EditEventModal from '@/components/EditEventModal.vue'

/* SEARCH */
const searchTerm = ref("")

function searchEvents(query) {
  searchTerm.value = query
}

const filteredEvents = computed(() => {
  if (!searchTerm.value.trim()) return events.value

  const term = searchTerm.value.toLowerCase()

  return events.value.filter(e =>
    e.title.toLowerCase().includes(term) ||
    e.description.toLowerCase().includes(term) ||
    e.location.toLowerCase().includes(term) ||
    e.category.toLowerCase().includes(term) ||
    e.reportedBy.toLowerCase().includes(term)
  )
})

/* MODAL STATES */
const showNewEvent = ref(false)
const showEventDetails = ref(false)
const showEditEvent = ref(false)
const selectedEvent = ref(null)

/* EVENTS */
const events = ref([
  {
    id: 1,
    title: 'Pothole on Santa Catarina Street',
    category: 'Infrastructure',
    location: 'Rua de Santa Catarina, Porto',
    coords: [41.1487, -8.6070],
    description: 'Large pothole causing traffic slowdown.',
    priority: 'High',
    reportedBy: 'City Resident',
    date: '2026-04-10 14:22',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Traffic Light Malfunction at Glicínias Roundabout',
    category: 'Traffic',
    location: 'Rotunda do Glicínias, Aveiro',
    coords: [40.6405, -8.6538],
    description: 'Traffic lights blinking yellow.',
    priority: 'Medium',
    reportedBy: 'Municipal Agent',
    date: '2026-04-11 09:10',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Overflowing Trash Container',
    category: 'Environment',
    location: 'Avenida da Liberdade, Lisbon',
    coords: [38.7369, -9.1427],
    description: 'Trash container full and spilling.',
    priority: 'Low',
    reportedBy: 'Local Business',
    date: '2026-04-12 11:45',
    status: 'pending'
  }
])

/* CATEGORY COLORS */
const categoryColors = {
  Infrastructure: '#2D9CDB',
  Traffic: '#F2C94C',
  Environment: '#27AE60',
  Security: '#EB5757',
  Health: '#BB6BD9',
  Default: '#BB6BD9'
}

/* MAP + MARKERS */
let map
let markerCluster
const markerRefs = ref({})

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

  events.value.forEach(event => addMarker(event))
})

function addMarker(event) {
  if (!event.coords || event.coords.length !== 2) {
    console.warn("Skipping marker with invalid coords:", event)
    return
  }

  const color = categoryColors[event.category] || categoryColors.Default

  const marker = L.marker(event.coords, {
    icon: createColoredIcon(color)
  })

  marker.bindPopup(`
    <strong>${event.title}</strong><br>
    ${event.location}<br>
    <em>${event.category}</em><br>
    <small>Priority: ${event.priority}</small><br>
    <small>Reported by: ${event.reportedBy}</small><br>
    <small>Date: ${event.date}</small>
  `)

  markerCluster.addLayer(marker)
  markerRefs.value[event.id] = marker
}

/* EVENT ACTIONS */
function openEventDetails(event) {
  selectedEvent.value = event
  showEventDetails.value = true
}

function openEditEvent(event) {
  selectedEvent.value = event
  showEventDetails.value = false
  showEditEvent.value = true
}

function deleteEvent(id) {
  events.value = events.value.filter(e => e.id !== id)

  const marker = markerRefs.value[id]
  if (marker) {
    markerCluster.removeLayer(marker)
    delete markerRefs.value[id]
  }

  showEventDetails.value = false
}

function confirmEvent(event) {
  const index = events.value.findIndex(e => e.id === event.id)
  if (index !== -1) events.value[index].status = 'confirmed'

  showEventDetails.value = false
}

function rejectEvent(event) {
  const index = events.value.findIndex(e => e.id === event.id)
  if (index !== -1) events.value[index].status = 'rejected'

  showEventDetails.value = false

  setTimeout(() => deleteEvent(event.id), 3000)
}

function forwardEvent(event) {
  console.log("Event forwarded:", event)
}

/* UPDATE EVENT + UPDATE PIN COLOR */
function saveEditedEvent(updated) {
  const index = events.value.findIndex(e => e.id === updated.id)
  if (index === -1) return

  // Normalize coords
  let coords = updated.coords
  if (coords && typeof coords === 'object' && !Array.isArray(coords)) {
    coords = [coords.lat, coords.lng]
  }

  if (
    !coords ||
    !Array.isArray(coords) ||
    coords.length !== 2 ||
    typeof coords[0] !== 'number' ||
    typeof coords[1] !== 'number'
  ) {
    console.error('INVALID COORDS RECEIVED:', coords)
    return
  }

  // Update event
  const finalEvent = {
    ...events.value[index],
    ...updated,
    coords
  }
  events.value[index] = finalEvent

  // Update markerRefs entry (we’ll recreate the actual marker below)
  delete markerRefs.value[finalEvent.id]

  // 🔥 Hard reset: rebuild the whole cluster from events
  markerCluster.clearLayers()
  markerRefs.value = {}

  events.value.forEach(ev => {
    if (!ev.coords || ev.coords.length !== 2) return

    const color = categoryColors[ev.category] || categoryColors.Default
    const marker = L.marker(ev.coords, {
      icon: createColoredIcon(color)
    })

    marker.bindPopup(`
      <strong>${ev.title}</strong><br>
      ${ev.location}<br>
      <em>${ev.category}</em><br>
      <small>Priority: ${ev.priority}</small><br>
      <small>Reported by: ${ev.reportedBy}</small><br>
      <small>Date: ${ev.date}</small>
    `)

    markerCluster.addLayer(marker)
    markerRefs.value[ev.id] = marker
  })

  showEditEvent.value = false
}



/* CREATE EVENT */
function createEvent(data) {
  const newEvent = {
    id: Date.now(),
    title: data.title,
    category: data.category,
    location: data.location,
    coords: [39.5, -8.0],
    description: data.description,
    priority: data.priority,
    reportedBy: data.reportedBy || 'Unknown Reporter',
    date: data.date,
    status: 'pending'
  }

  events.value.unshift(newEvent)
  addMarker(newEvent)
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

/* CUSTOM SCROLLBAR */
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

* {
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a #0d0d0d;
}
</style>
