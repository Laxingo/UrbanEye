<template>
  <div class="dashboard">
    <Sidebar />

    <div class="main">
      <Navbar @open-new-event="startLocationSelection" @search="searchEvents" />

      <div class="content">
        <div class="map-area">
          <div v-if="isSelectingLocation" class="map-instruction">
            Click on the map to choose the event location
          </div>

          <div id="map" class="map-container"></div>
        </div>

        <aside class="events-panel">
          <h2 class="panel-title">Occurences Near You</h2>

          <div v-if="loading" class="empty-state">
            Loading events...
          </div>

          <div v-else-if="filteredEvents.length === 0" class="empty-state">
            No events found.
          </div>

          <div v-else class="events-list">
            <EventCard v-for="event in filteredEvents" :key="event.id" v-bind="event" @click="openEventDetails(event)"
              class="event-clickable" />
          </div>

          <div v-if="!showAllEvents && sortedByDistance.length > 5" @click="showAllEvents = true" class="occ-divider">
            <span>+ occurrences</span>
          </div>

          <div v-if="showAllEvents && sortedByDistance.length > 5" @click="showAllEvents = false" class="occ-divider">
            <span>- occurrences</span>
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </aside>
      </div>
    </div>

    <NewEventForm
  v-if="showNewEvent"
  :initialCoords="selectedMapCoords"
  @close="closeNewEventForm"
  @submit="handleEventCreated"
/>

    <EventDetailsModal v-if="showEventDetails && session && selectedEvent" :event="selectedEvent" :isAdmin="isStaff"
      :currentUserEmail="session.email" @close="showEventDetails = false" @edit="openEditEvent" @delete="deleteEvent"
      @confirm="confirmEvent" @reject="rejectEvent" @forward="openForwardingModal" />

    <EditEventModal v-if="showEditEvent && selectedEvent" :event="selectedEvent" @close="showEditEvent = false"
      @save="saveEditedEvent" @forward="openForwardingModal" />

    <CreateForwardingModal v-if="showForwardModal" :event="forwardEventData" @close="showForwardModal = false"
      @forwarding-created="handleForwardingCreated" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from "vue"
import { useRouter } from "vue-router"

import L from "leaflet"
import "leaflet.markercluster"

import api from "@/services/api.js"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import EventCard from "@/components/EventCard.vue"
import NewEventForm from "@/components/NewEventForm.vue"
import EventDetailsModal from "@/components/EventDetailModal.vue"
import EditEventModal from "@/components/EditEventModal.vue"
import CreateForwardingModal from "@/components/CreateForwardingModal.vue"

const router = useRouter()

const session = ref(null)
const events = ref([])
const categories = ref([])

const loading = ref(false)
const errorMessage = ref("")

const showNewEvent = ref(false)
const showEventDetails = ref(false)
const showEditEvent = ref(false)
const showForwardModal = ref(false)
const showAllEvents = ref(false)

const selectedEvent = ref(null)
const forwardEventData = ref(null)

const searchTerm = ref("")
const userLocation = ref(null)

const isSelectingLocation = ref(false)
const selectedMapCoords = ref(null)
let tempLocationMarker = null

let map = null
let markerCluster = null
let userMarker = null

const markerRefs = ref({})

const isStaff = computed(() => {
  return ["moderador", "gestor_municipal"].includes(session.value?.role)
})

const categoryColors = {
  Infrastructure: "#2D9CDB",
  Traffic: "#F2C94C",
  Environment: "#27AE60",
  Security: "#EB5757",
  Health: "#BB6BD9",
  Default: "#BB6BD9"
}

async function handleForwardingCreated() {
  showForwardModal.value = false
  await loadEvents()
}

function splitDescription(rawDescription) {
  if (!rawDescription) {
    return {
      title: "Untitled event",
      description: ""
    }
  }

  if (rawDescription.includes("—")) {
    const parts = rawDescription.split("—")

    return {
      title: parts[0].trim(),
      description: parts.slice(1).join("—").trim()
    }
  }

  return {
    title: rawDescription.length > 45
      ? rawDescription.slice(0, 45) + "..."
      : rawDescription,
    description: rawDescription
  }
}

function mapStatusFromApi(status) {
  if (status === "falso") return "rejected"
  if (status === "resolvido") return "confirmed"
  if (status === "encaminhado") return "confirmed"

  return "pending"
}

function mapStatusToApi(status) {
  if (status === "rejected") return "falso"
  if (status === "confirmed") return "ativo"

  return "pendente"
}

function getCategoryName(event) {
  if (event.Category?.nome_categoria) return event.Category.nome_categoria
  if (event.category?.nome_categoria) return event.category.nome_categoria

  const category = categories.value.find(
    cat => Number(cat.id_categoria) === Number(event.id_categoria)
  )

  return category?.nome_categoria || "Unknown"
}

function getReporter(event) {
  if (event.User?.email) return event.User.email
  if (event.user?.email) return event.user.email
  if (event.Utilizador?.email) return event.Utilizador.email
  if (event.utilizador?.email) return event.utilizador.email

  return `User #${event.id_utilizador}`
}

function mapEventFromApi(event) {
  const descriptionData = splitDescription(event.descricao)

  return {
    id: event.id_evento,
    id_evento: event.id_evento,
    title: descriptionData.title,
    category: getCategoryName(event),
    categoryId: event.id_categoria,
    location: event.descricao_local || "Unknown location",
    coords: [
      Number(event.latitude),
      Number(event.longitude)
    ],
    description: descriptionData.description,
    priority: "Medium",
    reportedBy: getReporter(event),
    reportedById: event.id_utilizador,
    date: event.createdAt
      ? new Date(event.createdAt).toLocaleString()
      : "",
    status: mapStatusFromApi(event.estado)
  }
}

async function loadCategories() {
  const response = await api.get("/categories")

  categories.value = Array.isArray(response.data)
    ? response.data
    : response.data.categories || []
}

async function loadEvents() {
  loading.value = true
  errorMessage.value = ""

  try {
    await loadCategories()

    const response = await api.get("/events")

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.events || []

    events.value = data.map(mapEventFromApi)

    rebuildMarkers()
  } catch (error) {
    console.error("Error loading events:", error)
    errorMessage.value =
      error.response?.data?.message || "Error loading events."
  } finally {
    loading.value = false
  }
}

function searchEvents(query) {
  searchTerm.value = query
}

const filteredEvents = computed(() => {
  let list = sortedByDistance.value

  if (!searchTerm.value.trim()) {
    return showAllEvents.value ? list : list.slice(0, 5)
  }

  const term = searchTerm.value.toLowerCase()

  return list.filter(event =>
    event.title.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term) ||
    event.location.toLowerCase().includes(term) ||
    event.category.toLowerCase().includes(term) ||
    event.reportedBy.toLowerCase().includes(term)
  )
})

const sortedByDistance = computed(() => {
  if (!userLocation.value) return events.value

  return [...events.value]
    .filter(event => event.coords && event.coords.length === 2)
    .map(event => ({
      ...event,
      distance: distanceInKm(userLocation.value, event.coords)
    }))
    .sort((a, b) => a.distance - b.distance)
})

function createColoredIcon(color) {
  const svg = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
    </svg>
  `

  return L.divIcon({
    className: "pin-wrapper",
    html: `<div class="pin" style="color:${color}">${svg}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26]
  })
}

function initMap() {
  map = L.map("map", {
    zoomControl: false,
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: false,
    keyboard: false,
    inertia: true,
    inertiaDeceleration: 2200,
    inertiaMaxSpeed: 3000,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    minZoom: 12,
    maxZoom: 18
  }).setView([41.3533, -8.7452], 14)

  map.on("click", handleMapLocationClick)

  const bounds = L.latLngBounds(
    [41.3300, -8.7900],
    [41.3900, -8.7000]
  )

  map.setMaxBounds(bounds)
  map.options.maxBoundsViscosity = 0.35

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map)

  markerCluster = L.markerClusterGroup({
    animateAddingMarkers: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
  })

  map.addLayer(markerCluster)
}

function addMarker(event) {
  if (!event.coords || event.coords.length !== 2) return

  const latitude = Number(event.coords[0])
  const longitude = Number(event.coords[1])

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return

  const color = categoryColors[event.category] || categoryColors.Default

  const marker = L.marker([latitude, longitude], {
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

  marker.on("click", () => openEventDetails(event))

  markerCluster.addLayer(marker)
  markerRefs.value[event.id] = marker
}

function rebuildMarkers() {
  if (!markerCluster) return

  markerCluster.clearLayers()
  markerRefs.value = {}

  events.value.forEach(event => addMarker(event))
}

function openEventDetails(event) {
  selectedEvent.value = event
  showEventDetails.value = true
}

function openEditEvent(event) {
  selectedEvent.value = event
  showEventDetails.value = false
  showEditEvent.value = true
}

async function deleteEvent(id) {
  const confirmed = confirm("Are you sure you want to delete this event?")

  if (!confirmed) return

  try {
    await api.delete(`/events/${id}`)

    events.value = events.value.filter(event => event.id !== id)

    const marker = markerRefs.value[id]

    if (marker) {
      markerCluster.removeLayer(marker)
      delete markerRefs.value[id]
    }

    showEventDetails.value = false
  } catch (error) {
    console.error("Error deleting event:", error)
    errorMessage.value =
      error.response?.data?.message || "Error deleting event."
  }
}

async function confirmEvent(event) {
  try {
    await api.post(`/events/${event.id}/confirmations`, {
      tipo_confirmacao: "confirmacao"
    })

    event.status = "confirmed"

    const index = events.value.findIndex(item => item.id === event.id)
    if (index !== -1) events.value[index] = { ...event }

    showEventDetails.value = false

    setTimeout(() => {
      selectedEvent.value = { ...event }
      showEventDetails.value = true
    }, 50)
  } catch (error) {
    console.error("Error confirming event:", error)
    errorMessage.value =
      error.response?.data?.message || "Error confirming event."
  }
}

async function rejectEvent(event) {
  try {
    await api.post(`/events/${event.id}/confirmations`, {
      tipo_confirmacao: "rejeicao"
    })

    event.status = "rejected"

    const index = events.value.findIndex(item => item.id === event.id)
    if (index !== -1) events.value[index] = { ...event }

    showEventDetails.value = false

    setTimeout(() => {
      selectedEvent.value = { ...event }
      showEventDetails.value = true
    }, 50)
  } catch (error) {
    console.error("Error rejecting event:", error)
    errorMessage.value =
      error.response?.data?.message || "Error rejecting event."
  }
}

async function saveEditedEvent(updated) {
  const category = categories.value.find(
    item => item.nome_categoria === updated.category
  )

  const coords = Array.isArray(updated.coords)
    ? updated.coords
    : [updated.coords?.lat, updated.coords?.lng]

  try {
    await api.patch(`/events/${updated.id}`, {
      descricao: `${updated.title} — ${updated.description}`,
      estado: mapStatusToApi(updated.status),
      latitude: coords[0],
      longitude: coords[1],
      descricao_local: updated.location,
      id_categoria: category?.id_categoria || updated.categoryId
    })

    const index = events.value.findIndex(event => event.id === updated.id)

    if (index !== -1) {
      events.value[index] = {
        ...events.value[index],
        ...updated,
        coords
      }
    }

    rebuildMarkers()
    showEditEvent.value = false
  } catch (error) {
    console.error("Error updating event:", error)
    errorMessage.value =
      error.response?.data?.message || "Error updating event."
  }
}

async function handleEventCreated() {
  showNewEvent.value = false
  selectedMapCoords.value = null
  isSelectingLocation.value = false

  if (tempLocationMarker && map) {
    map.removeLayer(tempLocationMarker)
    tempLocationMarker = null
  }

  await loadEvents()
}

function openForwardingModal(event) {
  forwardEventData.value = event
  showForwardModal.value = true
}

function getUserLocation() {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    position => {
      userLocation.value = [
        position.coords.latitude,
        position.coords.longitude
      ]

      if (!map) return

      const icon = L.divIcon({
        className: "user-pin",
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
    () => {
      console.warn("User denied location")
    }
  )
}

function distanceInKm(coord1, coord2) {
  const R = 6371
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180

  const lat1 = coord1[0] * Math.PI / 180
  const lat2 = coord2[0] * Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}


function startLocationSelection() {
  isSelectingLocation.value = true
  showNewEvent.value = false
  selectedMapCoords.value = null

  if (map) {
    map.getContainer().style.cursor = "crosshair"
  }
}

function closeNewEventForm() {
  showNewEvent.value = false
  selectedMapCoords.value = null
  isSelectingLocation.value = false

  if (tempLocationMarker && map) {
    map.removeLayer(tempLocationMarker)
    tempLocationMarker = null
  }

  if (map) {
    map.getContainer().style.cursor = ""
  }
}

function handleMapLocationClick(event) {
  if (!isSelectingLocation.value) return

  const { lat, lng } = event.latlng

  selectedMapCoords.value = {
    latitude: lat,
    longitude: lng
  }

  if (tempLocationMarker) {
    map.removeLayer(tempLocationMarker)
  }

  tempLocationMarker = L.marker([lat, lng], {
    icon: createColoredIcon("#2D9CDB")
  }).addTo(map)

  isSelectingLocation.value = false
  showNewEvent.value = true

  map.getContainer().style.cursor = ""
}

onMounted(async () => {
  const storedSession = localStorage.getItem("session")

  if (!storedSession) {
    router.push("/")
    return
  }

  session.value = JSON.parse(storedSession)

  await nextTick()

  initMap()
  getUserLocation()
  await loadEvents()
})

</script>

<style scoped>
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
  position: relative;
}

.map-instruction {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: #111;
  border: 1px solid #2d9cdb;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
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

.empty-state {
  color: #aaa;
  font-size: 14px;
  margin-top: 20px;
}

.error-message {
  color: #eb5757;
  font-size: 14px;
  margin-top: 16px;
}

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
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
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
</style>