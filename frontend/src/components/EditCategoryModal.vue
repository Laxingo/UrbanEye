<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Edit Category</h2>

      <div class="form">
        <label>Name</label>
        <input v-model="category.name" type="text" />

        <label>Color</label>
        <input v-model="category.color" type="color" />

        <label>Events Count</label>
        <input v-model.number="category.events" type="number" />
      </div>

      <button class="save-btn" @click="updateCategory">Save Changes</button>
      <button class="close-btn" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  categoryData: Object
})

const emit = defineEmits(["close"])

const category = ref({
  id: null,
  name: "",
  color: "#2D9CDB",
  events: 0
})

onMounted(() => {
  category.value = { ...props.categoryData }
})

function updateCategory() {
  const stored = JSON.parse(localStorage.getItem("categories")) || []

  const updated = stored.map(c =>
    c.id === category.value.id ? { ...category.value } : c
  )

  localStorage.setItem("categories", JSON.stringify(updated))

  window.dispatchEvent(new Event("categories-updated"))

  emit("close")
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #111;
  padding: 24px;
  width: 360px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  animation: slideUp 0.25s ease;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

input {
  background: #222;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 6px;
  color: #fff;
}

.save-btn {
  width: 100%;
  background: #2d9cdb;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 600;
}

.close-btn {
  width: 100%;
  background: #444;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
