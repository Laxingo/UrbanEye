<template>
  <div class="event-card" :class="statusClass">
    <div class="header">
      <h3 class="title">{{ title }}</h3>
      <span class="status">{{ status }}</span>
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
        <strong>Reported by:</strong> {{ reporter }}
      </div>

      <div class="meta-item category" :class="categoryClass">
        <strong>Category:</strong> {{ category }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  status: String,
  description: String,
  location: String,
  date: String,
  reporter: String,
  category: String
})

/* STATUS COLORS */
const statusClass = computed(() => {
  if (props.status === 'Pending') return 'pending'
  if (props.status === 'Confirmed') return 'confirmed'
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
  border-radius: 10px; /* smaller */
  padding: 14px; /* smaller */
  margin-bottom: 14px; /* smaller */
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.18s ease;
}

.event-card:hover {
  border-color: #2D9CDB;
  background: #141414;
  transform: translateY(-2px); /* smaller lift */
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px; /* smaller */
  font-weight: 600;
  color: #fff;
}

/* STATUS BADGE */
.status {
  font-size: 11px; /* smaller */
  font-weight: 600;
  padding: 3px 8px; /* smaller */
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

/* DESCRIPTION */
.desc {
  margin: 8px 0; /* smaller */
  opacity: 0.85;
  line-height: 1.4;
  font-size: 13px; /* smaller */
  color: #ccc;
}

/* META INFO */
.meta {
  display: flex;
  flex-direction: column;
  gap: 6px; /* smaller */
  font-size: 13px; /* smaller */
  color: #bbb;
}

.meta-item strong {
  color: #ddd;
}

/* CATEGORY COLORS */
.category {
  font-weight: 600;
}

/* Infrastructure */
.cat-infrastructure { color: #2D9CDB; }

/* Security */
.cat-security { color: #EB5757; }

/* Environment */
.cat-environment { color: #27AE60; }

/* Traffic */
.cat-traffic { color: #F2C94C; }

/* Health */
.cat-health { color: #BB6BD9; }

/* Default */
.cat-default { color: #999; }
</style>
