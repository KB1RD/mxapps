<template>
  <div>
    <b-modal
      title="My Apps"
      scrollable
      hide-footer
      :visible="value"
      @change="(v) => $emit('input', v)"
    >
      <b-form
        inline
        class="my-2 d-flex flex-row"
        @submit="(e) => { e.preventDefault(); open_manifest = tmp_url.trim() }"
      >
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0" style="flex-grow: 1;">
          <b-input v-model="tmp_url" required placeholder="App URL"/>
        </b-input-group>

        <b-button type="submit" variant="primary">+ Add</b-button>
      </b-form>

      <h2 class="text-muted mt-3">Apps</h2>
      <ClickableAppListGroup :account="account"/>

      <h2
        v-if="Object.keys(associations).length"
        class="text-muted mt-3"
      >Associations</h2>
      <b-list-group class="account-list-group">
        <AssociationItem
          v-for="key in Object.keys(associations)"
          :key="key"
          :id="key"
          :account="account"
          :assoc="associations[key]"
        />
      </b-list-group>
    </b-modal>

    <AppAddModal
      v-if="open_manifest"
      :url="open_manifest"
      :account="account"
      @exit="open_manifest = null"
    />
  </div>
</template>

<script>
import ClickableAppListGroup from './ClickableAppListGroup'
import AssociationItem from './AssociationItem'
import AppAddModal from './AppAddModal'

export default {
  components: { ClickableAppListGroup, AssociationItem, AppAddModal },
  props: {
    account: String,
    value: Boolean
  },
  genbind: {
    associations: {
      apply: ['account'],
      address: (id) =>
        ['net', 'kb1rd', 'apps', 'v0', id, 'assoc', 'listen'],
      default: {}
    }
  },
  data () {
    return {
      tmp_url: '',
      open_manifest: ''
    }
  }
}
</script>
