<template>
  <div class="event-card" :class="statusClass">
    <div class="header">
      <h3 class="title">{{ title }}</h3>

      <!-- STATUS BADGE -->
      <span class="status">
        <template v-if="status === 'pending'">Pending</template>
        <template v-else-if="status === 'confirmed'">✔ Verified</template>
        <template v-else-if="status === 'rejected'">✖ Rejected</template>
      </span>
    </div>

    <p class="desc">{{ description }}</p>

    <div class="meta">
      <div class="meta-item">
        <strong>Location:</strong> {{ location }}
      </div>

      <div class="meta-item">
        <strong>Date:</strong> {{ date }}
      </div>

      <div class="meta-item">
        <strong>Reported by:</strong> {{ reportedBy }}
      </div>

      <div class="meta-item category" :class="categoryClass">
        <strong>Category:</strong> {{ category }}
      </div>
      <p v-if="distance">📍 {{ distance.toFixed(1) }} km</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  status: String,          // pending | confirmed | rejected
  description: String,
  location: String,
  date: String,
  reportedBy: String,      // FIXED (was reporter)
  category: String
})

/* STATUS COLORS */
const statusClass = computed(() => {
  if (props.status === 'pending') return 'pending'
  if (props.status === 'confirmed') return 'confirmed'
  if (props.status === 'rejected') return 'rejected'
  return ''
})

/* CATEGORY COLORS */
const categoryClass = computed(() => {
  const c = props.category?.toLowerCase()

  if (!c) return ''

  if (c.includes('infrastructure')) return 'cat-infrastructure'
  if (c.includes('security')) return 'cat-security'
  if (c.includes('environment')) return 'cat-environment'
  if (c.includes('traffic')) return 'cat-traffic'
  if (c.includes('health')) return 'cat-health'

  return 'cat-default'
})
</script>

<style scoped>
.event-card {
  background: #111;
  border: 1px solid #2A2A2A;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 14px;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.18s ease, opacity 0.4s ease;
}

.event-card:hover {
  border-color: #2D9CDB;
  background: #141414;
  transform: translateY(-2px);
}

/* FADE OUT FOR REJECTED */
.event-card.rejected {
  opacity: 0.5;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

/* STATUS BADGE */
.status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  text-transform: uppercase;
}

.pending .status {
  background: rgba(242, 201, 76, 0.15);
  color: #F2C94C;
}

.confirmed .status {
  background: rgba(39, 174, 96, 0.15);
  color: #27AE60;
}

.rejected .status {
  background: rgba(235, 87, 87, 0.15);
  color: #EB5757;
}

/* DESCRIPTION */
.desc {
  margin: 8px 0;
  opacity: 0.85;
  line-height: 1.4;
  font-size: 13px;
  color: #ccc;
}

/* META INFO */
.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #bbb;
}

.meta-item strong {
  color: #ddd;
}

/* CATEGORY COLORS */
.category {
  font-weight: 600;
}

.cat-infrastructure { color: #2D9CDB; }
.cat-security { color: #EB5757; }
.cat-environment { color: #27AE60; }
.cat-traffic { color: #F2C94C; }
.cat-health { color: #BB6BD9; }
.cat-default { color: #999; }
</style>
