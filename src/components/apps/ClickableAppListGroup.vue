<template>
  <div>
    <p v-if="!apps.length" class="text-muted">
      <slot name="noapps-text">
        You have no apps. Enter the URL above and click "Add" to get started.
      </slot>
    </p>
    <b-list-group :flush="flush" class="account-list-group">
      <AppListItem
        v-for="app in apps"
        :key="app"
        :id="app"
        :account="account"
        @appclick="$emit('appclick', app)"
      />
    </b-list-group>
  </div>
</template>

<script>
import AppListItem from './AppListItem'

export default {
  components: { AppListItem },
  props: { account: String, flush: Boolean },
  genbind: {
    apps: {
      apply: ['account'],
      address: (id) =>
        ['net', 'kb1rd', 'apps', 'v0', id, 'userapp', 'listen'],
      default: []
    }
  }
}
</script>
