<template>
  <div style="display: flex; flex-direction: row; justify-content: center;">
    <b-card no-body class="room-list">
      <template v-slot:header>
        <div class="d-flex align-items-center justify-content-between">
          <span>Room List</span>
          <!-- <b-button pill variant="outline-primary">
            <b-icon-plus-circle-fill/>
          </b-button> -->
        </div>
      </template>
      <b-list-group flush>
        <b-list-group-item
          v-for="room in rooms"
          :key="room.id"
          class="d-flex align-items-center"
          href="#"
        >
          <b-avatar variant="dark" :src="room.avatar_url" class="mr-3"/>
          <div class="d-flex flex-column justify-content-start">
            <span class="mr-auto">{{ room.name }}</span>
            <small class="text-muted">
              {{ room.id }} - {{ room.type || 'Untyped' }}
            </small>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
// import { BIconPlusCircleFill } from 'bootstrap-vue'

export default {
  // components: { BIconPlusCircleFill },
  genbind: {
    rooms: {
      apply: ['id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenRoomList'],
      default: []
    }
  },
  computed: {
    id () {
      return this.$route.query.account
    }
  }
}
</script>

<style scoped>
  .room-list {
    margin: 10px;
    flex-grow: 1;
    max-width: 750px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
</style>
