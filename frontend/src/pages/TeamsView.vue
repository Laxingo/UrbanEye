<template>
  <div class="teams-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.avatar"
        :isUser="true"
        @open-create-team="openCreateTeam"
      />

      <div class="content">
        <div class="container">
          <div class="header-row">
            <h2 class="title">Teams</h2>
          </div>

          <div v-if="loading" class="empty-state">
            Loading teams...
          </div>

          <div v-else-if="teams.length === 0" class="empty-state">
            No teams found.
          </div>

          <div v-else class="grid">
            <div class="team-card" v-for="team in teams" :key="team.id">
              <div class="icon-box" :style="{ background: team.color + '22' }">
                <UsersIcon class="icon" :style="{ color: team.color }" />
              </div>

              <h3 class="t-title">{{ team.name }}</h3>
              <p class="t-category">{{ team.entityName }}</p>

              <div class="info">
                <p class="line">
                  <EnvelopeIcon class="inline-icon" />
                  {{ team.email || "No email" }}
                </p>

                <p class="line">
                  <PhoneIcon class="inline-icon" />
                  {{ team.phone || "No phone" }}
                </p>
              </div>

              <button class="view-btn" @click="openModal(team)">
                View
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <CreateTeamModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @team-created="handleTeamCreated"
    />

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ selectedTeam.name }}</h2>
        <p class="modal-desc">{{ selectedTeam.entityName }}</p>

        <div class="modal-info">
          <p><strong>Email:</strong> {{ selectedTeam.email || "No email" }}</p>
          <p><strong>Phone:</strong> {{ selectedTeam.phone || "No phone" }}</p>
          <p><strong>Entity ID:</strong> {{ selectedTeam.id_entidade }}</p>
        </div>

        <div v-if="isManager" class="actions">
          <button class="delete-btn" @click="deleteTeam">
            Delete
          </button>
        </div>

        <button class="close-btn" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import api from "@/services/api.js"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import CreateTeamModal from "@/components/CreateTeamModal.vue"

import {
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/vue/24/outline"

const session = ref({})
const teams = ref([])
const loading = ref(false)
const errorMessage = ref("")

const showModal = ref(false)
const showCreateModal = ref(false)
const selectedTeam = ref(null)

const isManager = ref(false)

const colors = [
  "#2D9CDB",
  "#27AE60",
  "#F2C94C",
  "#EB5757",
  "#9B51E0",
  "#F2994A"
]

// Adapta cada equipa da API ao cartão mostrado na página.
function mapTeamFromApi(team, index) {
  const entity = team.ResponsibleEntity || team.responsibleEntity || {}

  return {
    id: team.id_equipa,
    id_equipa: team.id_equipa,
    name: team.nome_equipa,
    id_entidade: team.id_entidade,
    entityName: entity.nome_entidade || "Responsible entity",
    email: entity.email || "",
    phone: entity.telefone || "",
    color: colors[index % colors.length]
  }
}

// Carrega a lista atual de equipas.
async function loadTeams() {
  loading.value = true
  errorMessage.value = ""

  try {
    const response = await api.get("/teams")

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.teams || []

    teams.value = data.map(mapTeamFromApi)
  } catch (error) {
    console.error("Error loading teams:", error)
    errorMessage.value =
      error.response?.data?.message || "Error loading teams."
  } finally {
    loading.value = false
  }
}

// Controla o modal com os detalhes da equipa.
function openModal(team) {
  selectedTeam.value = team
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTeam.value = null
}

// Abre a criação apenas para gestores municipais.
function openCreateTeam() {
  if (!isManager.value) {
    errorMessage.value = "You do not have permission to create teams."
    return
  }

  showCreateModal.value = true
}

// Elimina a equipa selecionada depois da confirmação.
async function deleteTeam() {
  if (!selectedTeam.value) return

  const confirmed = confirm("Are you sure you want to delete this team?")

  if (!confirmed) return

  try {
    await api.delete(`/teams/${selectedTeam.value.id}`)
    closeModal()
    await loadTeams()
  } catch (error) {
    console.error("Error deleting team:", error)
    errorMessage.value =
      error.response?.data?.message || "Error deleting team."
  }
}

async function handleTeamCreated() {
  showCreateModal.value = false
  await loadTeams()
}

onMounted(() => {
  const storedSession = JSON.parse(localStorage.getItem("session"))
  session.value = storedSession || {}
  isManager.value = session.value.role === "gestor_municipal"

  loadTeams()
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 28px;
  font-weight: 700;
}

.grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

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

.empty-state {
  margin-top: 30px;
  color: #aaa;
  font-size: 15px;
}

.error-message {
  margin-top: 20px;
  color: #eb5757;
}

.modal-overlay {
  position: fixed;
  inset: 0;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
