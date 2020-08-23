<template>
  <b-list-group-item class="d-flex align-items-center ellipsis-flex-overflow">
    <template v-if="app === 'LOADING'">
      <b-spinner
        style="width: 1rem; height: 1rem;"
        variant="primary"
        label="Loading..."
      />
    </template>
    <template v-else>
      <b-avatar class="mr-3"><BIconBox /></b-avatar>
      <div class="d-flex flex-column" style="flex-grow: 1;">
        <span class="font-weight-bold">{{ app.title }}</span>
        <small class="text-muted">
          <b-badge variant="primary">
            v{{ app.version[0] }}.{{ app.version[1] }}.{{ app.version[2] }}
          </b-badge>
          {{ id }}
        </small>
        <span v-if="app.description" class="text-muted">
          {{ app.description }}
        </span>
      </div>
    </template>
  </b-list-group-item>
</template>

<script>
import { BIconBox } from 'bootstrap-vue'

export default {
  components: { BIconBox },
  props: {
    account: String,
    id: String
  },
  genbind: {
    app: {
      apply: ['account', 'id'],
      address: (ac, id) =>
        ['net', 'kb1rd', 'apps', 'v0', ac, 'userapp', id, 'listen'],
      default: 'LOADING'
    }
  }
}
</script>
