<template>
  <div class="teams-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.photo"
        :isUser="true"
        @open-create-team="showCreateModal = true"
      />

      <div class="content">
        <div class="container">

          <div class="header-row">
            <h2 class="title">Teams</h2>
          </div>

          <div class="grid">
            <div class="team-card" v-for="team in teams" :key="team.id">
              <div class="icon-box" :style="{ background: team.color + '22' }">
                <UsersIcon class="icon" :style="{ color: team.color }" />
              </div>

              <h3 class="t-title">{{ team.name }}</h3>
              <p class="t-category">{{ team.category }}</p>

              <div class="info">
                <p class="line"><UsersIcon class="inline-icon" /> {{ team.members }} members</p>
                <p class="line"><EnvelopeIcon class="inline-icon" /> {{ team.email }}</p>
                <p class="line"><PhoneIcon class="inline-icon" /> {{ team.phone }}</p>
              </div>

              <button class="view-btn" @click="openModal(team)">View</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- CREATE TEAM -->
    <CreateTeamModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
    />

    <!-- EDIT TEAM -->
    <EditTeamModal
      v-if="showEditModal"
      :teamData="selectedTeam"
      @close="showEditModal = false"
    />

    <!-- VIEW TEAM -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ selectedTeam.name }}</h2>
        <p class="modal-desc">{{ selectedTeam.category }}</p>

        <div class="modal-info">
          <p><strong>Members:</strong> {{ selectedTeam.members }}</p>
          <p><strong>Email:</strong> {{ selectedTeam.email }}</p>
          <p><strong>Phone:</strong> {{ selectedTeam.phone }}</p>
          <p><strong>Handles:</strong> {{ selectedTeam.handles.join(', ') }}</p>
        </div>

        <div class="actions">
          <button class="edit-btn" @click="openEditModal">Edit</button>
          <button class="delete-btn" @click="deleteTeam">Delete</button>
        </div>

        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import CreateTeamModal from "@/components/CreateTeamModal.vue"
import EditTeamModal from "@/components/EditTeamModal.vue"

import { UsersIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/vue/24/outline"

const session = ref({})
const teams = ref([])
const categories = ref([])

const showModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)

const selectedTeam = ref(null)

function openModal(team) {
  selectedTeam.value = team
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function openEditModal() {
  showModal.value = false
  showEditModal.value = true
}

function deleteTeam() {
  const stored = JSON.parse(localStorage.getItem("teams")) || []
  const updated = stored.filter(t => t.id !== selectedTeam.value.id)

  localStorage.setItem("teams", JSON.stringify(updated))
  window.dispatchEvent(new Event("teams-updated"))

  showModal.value = false
}

function loadTeams() {
  const storedTeams = JSON.parse(localStorage.getItem("teams")) || []
  teams.value = [...storedTeams]
}

function loadCategories() {
  categories.value = JSON.parse(localStorage.getItem("categories")) || []
}

onMounted(() => {
  const s = JSON.parse(localStorage.getItem("session"))
  session.value = s || {}

  loadCategories()
  loadTeams()

  window.addEventListener("teams-updated", loadTeams)
})
</script>

<style scoped>
.teams-page {
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
  justify-content: center;
  padding-top: 40px;
  overflow-y: auto;
}

.container {
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
}

/* HEADER */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 28px;
  font-weight: 700;
}

/* GRID */
.grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* CARD */
.team-card {
  background: #111;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #1a1a1a;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 26px;
  height: 26px;
}

.t-title {
  font-size: 18px;
  font-weight: 600;
}

.t-category {
  opacity: 0.6;
  font-size: 14px;
}

.info {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.inline-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

.line {
  opacity: 0.8;
  font-size: 13px;
}

.view-btn {
  margin-top: 8px;
  background: #2d9cdb;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  align-self: flex-start;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  z-index: 999;
}

.modal {
  background: #111;
  padding: 26px;
  width: 380px;
  border-radius: 12px;
  animation: slideUp 0.25s ease;
  border: 1px solid #2a2a2a;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.modal-desc {
  opacity: 0.8;
  margin-bottom: 16px;
}

.modal-info p {
  margin: 4px 0;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.edit-btn {
  flex: 1;
  background: #f2c94c;
  border: none;
  padding: 8px;
  border-radius: 6px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
}

.delete-btn {
  flex: 1;
  background: #eb5757;
  border: none;
  padding: 8px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.close-btn {
  margin-top: 18px;
  width: 100%;
  background: #2d9cdb;
  border: none;
  padding: 9px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
