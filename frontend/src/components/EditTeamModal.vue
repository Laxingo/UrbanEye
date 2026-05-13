<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Edit Team</h2>

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

      <button class="save-btn" @click="updateTeam">Save Changes</button>
      <button class="close-btn" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  teamData: Object
})

const emit = defineEmits(["close"])

const categories = ref([])
const team = ref({})

onMounted(() => {
  categories.value = JSON.parse(localStorage.getItem("categories")) || []

  team.value = {
    ...props.teamData,
    categoryId: categories.value.find(c => c.name === props.teamData.category)?.id
  }
})

function updateTeam() {
  const stored = JSON.parse(localStorage.getItem("teams")) || []
  const category = categories.value.find(c => c.id === team.value.categoryId)

  const updated = stored.map(t =>
    t.id === team.value.id
      ? {
          ...team.value,
          category: category.name,
          color: category.color,
          handles: category.handles
        }
      : t
  )

  localStorage.setItem("teams", JSON.stringify(updated))
  window.dispatchEvent(new Event("teams-updated"))
  emit("close")
}
</script>

<style scoped>
/* mesmo estilo do CreateTeamModal */
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

input, select {
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
</style>
