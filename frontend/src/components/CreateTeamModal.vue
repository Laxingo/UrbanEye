<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Create Team</h2>

      <div class="form">

        <label>Name</label>
        <input v-model="team.name" type="text" />

        <label>Category</label>
        <select v-model="team.categoryId">
          <option disabled value="">Select category</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>

        <label>Members</label>
        <input v-model.number="team.members" type="number" />

        <label>Email</label>
        <input v-model="team.email" type="email" />

        <label>Phone</label>
        <input v-model="team.phone" type="text" />
      </div>

      <button class="save-btn" @click="saveTeam">Save</button>
      <button class="close-btn" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const emit = defineEmits(["close"])

const categories = ref([])

const team = ref({
  name: "",
  categoryId: "",
  members: 0,
  email: "",
  phone: ""
})

onMounted(() => {
  categories.value = JSON.parse(localStorage.getItem("categories")) || []
})

function saveTeam() {
  const stored = JSON.parse(localStorage.getItem("teams")) || []

  const category = categories.value.find(c => c.id === team.value.categoryId)

  stored.push({
    id: Date.now(),
    name: team.value.name,
    category: category.name,
    color: category.color,
    members: team.value.members,
    email: team.value.email,
    phone: team.value.phone,
    handles: category.handles
  })

  localStorage.setItem("teams", JSON.stringify(stored))

  window.dispatchEvent(new Event("teams-updated"))

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
}

.close-btn {
  width: 100%;
  background: #444;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
}

select {
  background: #222;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  appearance: none;
  cursor: pointer;
}

/* Wrapper para permitir ícone customizado no futuro */
select:focus {
  outline: none;
  border-color: #2d9cdb;
  background: #1a1a1a;
}

/* SCROLL DO DROPDOWN */
select option {
  background: #111;
  color: #fff;
}

/* SCROLLBAR DO DROPDOWN */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #0d0d0d;
}

select::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #3a3a3a;
}

</style>
