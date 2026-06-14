<template>
  <div class="categories-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.avatar"
        :isUser="true"
        @open-create-category="showCreateModal = true"
      />

      <div class="content">
        <div class="container">
          <div class="header-row">
            <h2 class="title">Categories</h2>
          </div>

          <div v-if="loading" class="empty-state">
            Loading categories...
          </div>

          <div v-else-if="categories.length === 0" class="empty-state">
            No categories found.
          </div>

          <div v-else class="grid">
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

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <CreateCategoryModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @category-created="handleCategoryCreated"
    />

    <EditCategoryModal
      v-if="showEditModal"
      :categoryData="selectedCategory"
      @close="showEditModal = false"
      @category-updated="handleCategoryUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import api from "@/services/api.js"

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
const loading = ref(false)
const errorMessage = ref("")

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedCategory = ref(null)

const iconMap = {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  TruckIcon,
  FireIcon
}

const categoryVisuals = [
  { color: "#2D9CDB", icon: "BuildingOfficeIcon" },
  { color: "#EB5757", icon: "ShieldCheckIcon" },
  { color: "#27AE60", icon: "HeartIcon" },
  { color: "#6FCF97", icon: "GlobeAltIcon" },
  { color: "#F2C94C", icon: "TruckIcon" },
  { color: "#F2994A", icon: "FireIcon" }
]

// Junta os dados da categoria a uma cor e ícone da interface.
function mapCategoryFromApi(category, index) {
  const visual = categoryVisuals[index % categoryVisuals.length]

  return {
    id: category.id_categoria,
    name: category.nome_categoria,
    description: category.descricao_categoria,
    color: visual.color,
    icon: visual.icon,
    events: category.events || 0
  }
}

// Carrega a lista atual de categorias.
async function loadCategories() {
  loading.value = true
  errorMessage.value = ""

  try {
    const response = await api.get("/categories")

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.categories || []

    categories.value = data.map(mapCategoryFromApi)
  } catch (error) {
    console.error("Error loading categories:", error)
    errorMessage.value =
      error.response?.data?.message || "Error loading categories."
  } finally {
    loading.value = false
  }
}

// Abre o formulário com a categoria escolhida.
function openEditModal(category) {
  selectedCategory.value = category
  showEditModal.value = true
}

// Remove uma categoria depois da confirmação.
async function deleteCategory(id) {
  const confirmed = confirm("Are you sure you want to delete this category?")

  if (!confirmed) return

  try {
    await api.delete(`/categories/${id}`)
    await loadCategories()
  } catch (error) {
    console.error("Error deleting category:", error)
    errorMessage.value =
      error.response?.data?.message || "Error deleting category."
  }
}

async function handleCategoryCreated() {
  showCreateModal.value = false
  await loadCategories()
}

async function handleCategoryUpdated() {
  showEditModal.value = false
  selectedCategory.value = null
  await loadCategories()
}

onMounted(() => {
  const storedSession = JSON.parse(localStorage.getItem("session"))
  session.value = storedSession || {}

  loadCategories()
})
</script>

<style scoped>
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
  margin-left: 16px;
}

.c-title {
  font-size: 17px;
  font-weight: 600;
}

.c-events {
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;
}

.edit-btn:hover {
  color: #2d9cdb;
}

.delete-btn:hover {
  color: #eb5757;
}

.action-icon {
  width: 20px;
  height: 20px;
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
</style>
