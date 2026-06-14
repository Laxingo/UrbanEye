<template>
  <div class="profile-page">
    <Sidebar />

    <div class="main">
      <Navbar :avatar="profile.photo" />

      <div class="content">
        <div class="profile-container">

          <!-- HEADER -->
          <div class="header-row">
            <div
              class="avatar"
              :style="{ backgroundImage: profile.photo ? `url(${profile.photo})` : '' }"
            >
              <span v-if="!profile.photo">U</span>
            </div>

            <div class="header-info">
              <h2 class="name">{{ profile.name }}</h2>
              <p class="role">{{ profile.role }}</p>
            </div>

            <button class="edit-btn" @click="showEditModal = true">
              Edit Profile
            </button>
          </div>

          <!-- DETAILS SECTION -->
          <div class="details">
            <div class="detail-item">
              <EnvelopeIcon class="detail-icon" />
              <div>
                <strong>Email</strong>
                <p>{{ profile.email }}</p>
              </div>
            </div>



            <div class="detail-item">
              <BuildingOfficeIcon class="detail-icon" />
              <div>
                <strong>Department</strong>
                <p>{{ profile.department }}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <EditProfileModal
      v-if="showEditModal"
      :profile="profile"
      @close="showEditModal = false"
      @save="updateProfile"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import EditProfileModal from "@/components/EditProfileModal.vue"

import api from "@/services/api"

import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon
} from "@heroicons/vue/24/outline"

const router = useRouter()

const showEditModal = ref(false)

const profile = ref({
  id: null,
  name: "",
  role: "",
  email: "",
  department: "",
  photo: ""
})

// Carrega os dados do utilizador da sessão atual.
onMounted(async () => {
  const session = JSON.parse(localStorage.getItem("session"))

  if (!session?.id) {
    router.push("/")
    return
  }

  const response = await api.get(`/users/${session.id}`)
  const user = response.data.user

  profile.value = {
    id: user.id_utilizador,
    name: user.nome || "User",
    role: user.tipo_utilizador || "User",
    email: user.email,
    department: user.tipo_utilizador || "Not assigned",
    photo: user.fotografia || null
  }
})

// Guarda as alterações na API e atualiza também a sessão local.
async function updateProfile(updated) {
  const response = await api.patch(`/users/${profile.value.id}`, {
    nome: updated.name,
    email: updated.email,
    fotografia: updated.photo
  })

  const user = response.data.user

  profile.value = {
    ...profile.value,
    name: user.nome,
    email: user.email,
    role: user.tipo_utilizador,
    photo: user.fotografia
  }

  const session = JSON.parse(localStorage.getItem("session")) || {}

  const updatedSession = {
    ...session,
    name: user.nome,
    email: user.email,
    role: user.tipo_utilizador,
    avatar: user.fotografia
  }

  localStorage.setItem("session", JSON.stringify(updatedSession))

  showEditModal.value = false
}
</script>

<style scoped>
.profile-page {
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
  padding-top: 60px;
  overflow-y: auto;
}

/* MAIN CONTAINER */
.profile-container {
  width: 100%;
  max-width: 700px;
  padding: 0 20px;
}

/* HEADER ROW */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 90px;
  height: 90px;
  background: #2d9cdb;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  overflow: hidden;
}

.header-info {
  flex: 1;
  margin-left: 20px;
}

.name {
  font-size: 28px;
  font-weight: 600;
}

.role {
  opacity: 0.7;
  margin-top: 4px;
}

/* EDIT BUTTON */
.edit-btn {
  background: #2d9cdb;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

/* DETAILS SECTION — TWO PER LINE */
.details {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* DETAIL ITEM */
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.detail-icon {
  width: 26px;
  height: 26px;
  color: #2d9cdb;
  flex-shrink: 0;
}

.detail-item strong {
  font-size: 15px;
  color: #ddd;
}

.detail-item p {
  margin-top: 2px;
  opacity: 0.8;
}
</style>
