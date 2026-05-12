<template>
  <div class="dashboard">
  <Sidebar :isAdmin="currentUser?.role === 'admin'" />

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
          <h2 class="panel-title">Occurences Near You</h2>

          <div class="events-list">
            <EventCard
              v-for="event in filteredEvents"
              :key="event.id"
              v-bind="event"
              @click="openEventDetails(event)"
              class="event-clickable"
            />
          </div>
          <!-- Mostrar + occurrences -->
          <div
            v-if="!showAllEvents"
            @click="showAllEvents = true"
            class="occ-divider"
          >
            <span>+ occurrences</span>
          </div>

<transition name="expand">
  <div v-if="showAllEvents" class="all-events-wrapper">
    <div
      v-for="event in sortedEvents"
      :key="event.id"
      class="event-item"
      @click="openEventDetails(event)"
    >
      <EventCard :event="event" />
    </div>

    <!-- collapse divider -->
    <div
      @click="showAllEvents = false"
      class="occ-divider"
    >
      <span>- occurrences</span>
    </div>
  </div>
</transition>


        </aside>
      </div>
    </div>

    <!-- NEW EVENT MODAL -->
    <NewEventForm
      v-if="showNewEvent"
      @close="showNewEvent = false"
      @submit="createEvent"
    />

    <EventDetailsModal
      v-if="showEventDetails && session"
      :event="selectedEvent"
      :isAdmin="session.role === 'admin'"
      :currentUserEmail="session.email"
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
import { getCurrentUser } from "@/auth/auth"

const session = ref(null)

onMounted(() => {
  const stored = localStorage.getItem("session")
  if (stored) {
    session.value = JSON.parse(stored)
  }
})

const currentUser = getCurrentUser()

/* SEARCH */
const searchTerm = ref("")

function searchEvents(query) {
  searchTerm.value = query
}

const showAllEvents = ref(false)


const filteredEvents = computed(() => {
  let list = sortedByDistance.value

  if (!searchTerm.value.trim()) {
    return showAllEvents.value ? list : list.slice(0, 5)
  }

  const term = searchTerm.value.toLowerCase()

  return list.filter(e =>
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
    title: 'Buraco na Rua da Igreja',
    category: 'Infrastructure',
    location: 'Rua da Igreja, Vila do Conde',
    coords: [41.3539, -8.7481],
    description: 'Buraco grande na via, causando desvio de trânsito.',
    priority: 'High',
    reportedBy: 'Residente Local',
    date: '2026-04-10 14:22',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Semáforo avariado na Av. Júlio Graça',
    category: 'Traffic',
    location: 'Avenida Júlio Graça, Vila do Conde',
    coords: [41.3517, -8.7429],
    description: 'Semáforo intermitente, piscando amarelo.',
    priority: 'Medium',
    reportedBy: 'Agente Municipal',
    date: '2026-04-11 09:10',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Contentor de lixo a transbordar',
    category: 'Environment',
    location: 'Rua Dr. António José de Almeida, Vila do Conde',
    coords: [41.3548, -8.7420],
    description: 'Contentor cheio e lixo espalhado no chão.',
    priority: 'Low',
    reportedBy: 'Comerciante Local',
    date: '2026-04-12 11:45',
    status: 'pending'
  },
  {
  id: 4,
  title: 'Queda de árvore na Marginal',
  category: 'Infrastructure',
  location: 'Avenida do Brasil, Vila do Conde',
  coords: [41.3530, -8.7495],
  description: 'Árvore caída parcialmente a bloquear a ciclovia.',
  priority: 'Medium',
  reportedBy: 'Ciclista',
  date: '2026-04-13 10:15',
  status: 'pending'
},
{
  id: 5,
  title: 'Luz pública apagada',
  category: 'Infrastructure',
  location: 'Rua Comendador António Fernandes, Vila do Conde',
  coords: [41.3498, -8.7421],
  description: 'Candeeiro sem iluminação durante a noite.',
  priority: 'Low',
  reportedBy: 'Morador',
  date: '2026-04-13 21:40',
  status: 'pending'
},
{
  id: 6,
  title: 'Acidente ligeiro na rotunda',
  category: 'Traffic',
  location: 'Rotunda da Junqueira, Vila do Conde',
  coords: [41.3537, -8.7470],
  description: 'Colisão entre dois veículos, sem feridos.',
  priority: 'High',
  reportedBy: 'Agente Municipal',
  date: '2026-04-14 08:20',
  status: 'pending'
},
{
  id: 7,
  title: 'Contentor de reciclagem cheio',
  category: 'Environment',
  location: 'Rua Dr. Carlos Pinto Ferreira, Vila do Conde',
  coords: [41.3509, -8.7448],
  description: 'Contentor azul completamente cheio.',
  priority: 'Low',
  reportedBy: 'Residente',
  date: '2026-04-14 12:05',
  status: 'pending'
},
{
  id: 8,
  title: 'Ruído excessivo durante a noite',
  category: 'Security',
  location: 'Praça da República, Vila do Conde',
  coords: [41.3524, -8.7488],
  description: 'Grupo de pessoas a causar ruído após as 2h.',
  priority: 'Medium',
  reportedBy: 'Morador',
  date: '2026-04-15 02:30',
  status: 'pending'
},
{
  id: 9,
  title: 'Fuga de água na via pública',
  category: 'Infrastructure',
  location: 'Rua da Costa, Vila do Conde',
  coords: [41.3551, -8.7412],
  description: 'Água a sair de uma tampa de saneamento.',
  priority: 'High',
  reportedBy: 'Comerciante',
  date: '2026-04-15 11:10',
  status: 'pending'
},
{
  id: 10,
  title: 'Animal perdido',
  category: 'Security',
  location: 'Rua da Lapa, Vila do Conde',
  coords: [41.3560, -8.7465],
  description: 'Cão encontrado a vaguear sozinho.',
  priority: 'Low',
  reportedBy: 'Residente',
  date: '2026-04-15 17:55',
  status: 'pending'
},
{
  id: 11,
  title: 'Sinal de trânsito danificado',
  category: 'Traffic',
  location: 'Rua Dr. Leonardo Coimbra, Vila do Conde',
  coords: [41.3512, -8.7403],
  description: 'Sinal de STOP inclinado após impacto.',
  priority: 'Medium',
  reportedBy: 'Condutor',
  date: '2026-04-16 09:40',
  status: 'pending'
},
{
  id: 12,
  title: 'Lixo acumulado na praia',
  category: 'Environment',
  location: 'Praia de Vila do Conde',
  coords: [41.3535, -8.7602],
  description: 'Resíduos deixados após evento noturno.',
  priority: 'High',
  reportedBy: 'Turista',
  date: '2026-04-16 07:30',
  status: 'pending'
},
{
  id: 13,
  title: 'Pessoa ferida na ciclovia',
  category: 'Health',
  location: 'Ciclovia da Marginal, Vila do Conde',
  coords: [41.3542, -8.7511],
  description: 'Queda de bicicleta, vítima com ferimentos ligeiros.',
  priority: 'High',
  reportedBy: 'Passante',
  date: '2026-04-17 18:20',
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
  getUserLocation()

  map = L.map('map', {
    zoomControl: false,
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: false,
    keyboard: false,

    // Movimento suave
    inertia: true,
    inertiaDeceleration: 2200,
    inertiaMaxSpeed: 3000,

    // Zoom suave
    zoomAnimation: true,
    zoomAnimationThreshold: 4,

    minZoom: 12,
    maxZoom: 18
  }).setView([41.3533, -8.7452], 14)

  // Área maior e mais natural (Vila do Conde + Árvore + Mindelo)
  const bounds = L.latLngBounds(
    [41.3300, -8.7900], // sudoeste
    [41.3900, -8.7000]  // nordeste
  )

  // Limitação suave, elástica
  map.setMaxBounds(bounds)
  map.options.maxBoundsViscosity = 0.35

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerCluster = L.markerClusterGroup({
    animateAddingMarkers: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
  })

  map.addLayer(markerCluster)

  events.value.forEach(event => addMarker(event))

  getUserLocation()
})


function normalizeCategory(cat) {
  return cat
    .toLowerCase()
    .normalize("NFD")               // remove acentos
    .replace(/[\u0300-\u036f]/g, "") // remove marcas de acento
    .replace(/\s+/g, '-')            // troca espaços por -
    .replace(/[^a-z0-9\-]/g, '')     // remove caracteres estranhos
}



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
  <div class="ue-popup" style="--tag-color: ${color}">
    <div class="ue-popup-title">${event.title}</div>
    <div class="ue-popup-location">${event.location}</div>

    <div class="ue-popup-meta">
      <span class="ue-tag">${event.category}</span>
      <span class="ue-priority">Priority: ${event.priority}</span>
    </div>

    <div class="ue-popup-footer">
      <span>${event.reportedBy}</span>
      <span>${event.date}</span>
    </div>
  </div>
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
      // Atualizar o status
      event.status = "confirmed"

      // Atualizar o array de eventos
      const index = events.value.findIndex(e => e.id === event.id)
      if (index !== -1) {
        events.value[index] = { ...event }
      }

      // Guardar no localStorage
      localStorage.setItem("events", JSON.stringify(events.value))

      // Fechar e reabrir o modal para forçar re-render
      showEventDetails.value = false
      setTimeout(() => {
        selectedEvent.value = { ...event }
        showEventDetails.value = true
      }, 50)
    }

function rejectEvent(event) {
  event.status = "rejected"

  const index = events.value.findIndex(e => e.id === event.id)
  if (index !== -1) {
    events.value[index] = { ...event }
  }

  localStorage.setItem("events", JSON.stringify(events.value))

  showEventDetails.value = false
  setTimeout(() => {
    selectedEvent.value = { ...event }
    showEventDetails.value = true
  }, 50)
}

function forwardEvent(event) {
  event.status = "forwarded"

  const index = events.value.findIndex(e => e.id === event.id)
  if (index !== -1) {
    events.value[index] = { ...event }
  }

  localStorage.setItem("events", JSON.stringify(events.value))

  showEventDetails.value = false
  setTimeout(() => {
    selectedEvent.value = { ...event }
    showEventDetails.value = true
  }, 50)
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
      <div class="ue-popup">
        <div class="ue-popup-title">${event.title}</div>
        <div class="ue-popup-location">${event.location}</div>

        <div class="ue-popup-meta">
          <span class="ue-tag">${event.category}</span>
          <span class="ue-priority">Priority: ${event.priority}</span>
        </div>

        <div class="ue-popup-footer">
          <span>Reported by: ${event.reportedBy}</span>
          <span>${event.date}</span>
        </div>
      </div>
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

const userLocation = ref(null)
let userMarker = null

function getUserLocation() {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation.value = [
        pos.coords.latitude,
        pos.coords.longitude
      ]

      const icon = L.divIcon({
        className: 'user-pin',
        html: `<div style="
          width:16px;
          height:16px;
          background:#2d9cdb;
          border-radius:50%;
          border:3px solid white;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      userMarker = L.marker(userLocation.value, { icon })
      userMarker.addTo(map)
    },
    err => console.warn("User denied location")
  )
}


function distanceInKm(coord1, coord2) {
  const R = 6371
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180

  const lat1 = coord1[0] * Math.PI / 180
  const lat2 = coord2[0] * Math.PI / 180

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.sin(dLon/2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}


const nearbyEvents = computed(() => {
  if (!userLocation.value) return events.value

  return [...events.value]
    .map(ev => ({
      ...ev,
      distance: distanceInKm(userLocation.value, ev.coords)
    }))
    .sort((a, b) => a.distance - b.distance)
})

const sortedByDistance = computed(() => {
  if (!userLocation.value) return events.value

  return [...events.value]
    .map(ev => ({
      ...ev,
      distance: distanceInKm(userLocation.value, ev.coords)
    }))
    .sort((a, b) => a.distance - b.distance)
})


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

.occ-divider {
  margin: 18px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  user-select: none;
}

.occ-divider::before,
.occ-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #2a2a2a;
  margin: 0 12px;
}

.occ-divider span {
  font-size: 13px;
  color: #fff;
  letter-spacing: 0.5px;
}

.occ-divider:hover {
  opacity: 1;
}

:global(.leaflet-popup-content-wrapper) {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border: none !important;
}

:global(.leaflet-popup-tip) {
  display: none !important;
}

:global(.leaflet-popup-content) {
  margin: 0 !important;
  padding: 0 !important;
}

:global(.ue-popup) {
  background: #1c1c1c;
  padding: 16px 18px;
  border-radius: 12px;
  color: #f2f2f2;
  font-family: 'Inter', sans-serif;
  width: 240px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.45);
  animation: popupFade 0.25s ease-out;
}

:global(.ue-popup-title) {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #fff;
}

:global(.ue-popup-location) {
  font-size: 13px;
  opacity: 0.85;
  margin-bottom: 12px;
}

:global(.ue-popup-meta) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

:global(.ue-priority) {
  font-size: 11px;
  opacity: 0.8;
}

:global(.ue-popup-footer) {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  opacity: 0.65;
}

:global(.ue-tag) {
  background: var(--tag-color);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  display: inline-block;
}


@keyframes popupFade {
  from {
    transform: translateY(6px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>
