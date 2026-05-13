<template>
  <div class="categories-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.photo"
        :isUser="true"
        @open-create-category="showCreateModal = true"
      />

      <div class="content">
        <div class="container">
          <div class="header-row">
            <h2 class="title">Categories</h2>
          </div>

          <div class="grid">
            <div
              class="category-card"
              v-for="cat in categories"
              :key="cat.id"
            >
              <div class="icon-box" :style="{ background: cat.color + '22' }">
                <component
                  :is="iconMap[cat.icon]"
                  class="icon"
                  :style="{ color: cat.color }"
                />
              </div>

              <div class="info">
                <h3 class="c-title">{{ cat.name }}</h3>
                <p class="c-events">{{ cat.events }} events</p>
              </div>

              <div class="actions">
                <button class="edit-btn" @click="openEditModal(cat)">
                  <PencilIcon class="action-icon" />
                </button>
                <button class="delete-btn" @click="deleteCategory(cat.id)">
                  <TrashIcon class="action-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <CreateCategoryModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
    />

    <EditCategoryModal
      v-if="showEditModal"
      :categoryData="selectedCategory"
      @close="showEditModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import CreateCategoryModal from "@/components/CreateCategoryModal.vue"
import EditCategoryModal from "@/components/EditCategoryModal.vue"

import {
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  TruckIcon,
  FireIcon
} from "@heroicons/vue/24/outline"

const session = ref({})
const categories = ref([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedCategory = ref(null)

/* ICON MAP */
const iconMap = {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  TruckIcon,
  FireIcon
}

/* BASE CATEGORIES */
const baseCategories = [
  {
    id: 1,
    name: "Infrastructure",
    color: "#2D9CDB",
    events: 0,
    icon: "BuildingOfficeIcon"
  },
  {
    id: 2,
    name: "Security",
    color: "#EB5757",
    events: 0,
    icon: "ShieldCheckIcon"
  },
  {
    id: 3,
    name: "Health",
    color: "#27AE60",
    events: 0,
    icon: "HeartIcon"
  },
  {
    id: 4,
    name: "Environment",
    color: "#6FCF97",
    events: 0,
    icon: "GlobeAltIcon"
  },
  {
    id: 5,
    name: "Traffic",
    color: "#F2C94C",
    events: 0,
    icon: "TruckIcon"
  },
  {
    id: 6,
    name: "Fire & Rescue",
    color: "#F2994A",
    events: 0,
    icon: "FireIcon"
  }
]

function loadCategories() {
  const stored = JSON.parse(localStorage.getItem("categories")) || []

  // Filtrar categorias criadas pelo utilizador (id > 6)
  const userCategories = stored.filter(c => c.id > 6)

  // Merge final
  categories.value = [...baseCategories, ...userCategories]
}

function openEditModal(cat) {
  selectedCategory.value = cat
  showEditModal.value = true
}

function deleteCategory(id) {
  const stored = JSON.parse(localStorage.getItem("categories")) || []
  const updated = stored.filter(c => c.id !== id)
  localStorage.setItem("categories", JSON.stringify(updated))
  window.dispatchEvent(new Event("categories-updated"))
}

onMounted(() => {
  const s = JSON.parse(localStorage.getItem("session"))
  session.value = s || {}

  loadCategories()
  window.addEventListener("categories-updated", loadCategories)
})
</script>

<style scoped>
/* Mantive exatamente o teu estilo premium/dark */

.categories-page {
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
  max-width: 900px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-card {
  background: #111;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #1a1a1a;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 22px;
  height: 22px;
}

.info {
  flex: 1;
  margin-left: 14px;
}

.c-title {
  font-size: 16px;
  font-weight: 600;
}

.c-events {
  opacity: 0.7;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  background: #1a1a1a;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.25s ease;
}

.edit-btn:hover {
  background: #2d9cdb;
}

.delete-btn:hover {
  background: #eb5757;
}

.action-icon {
  width: 18px;
  height: 18px;
  color: #fff;
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
