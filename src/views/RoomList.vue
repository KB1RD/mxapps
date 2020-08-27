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
          @click="openRoomInfer(room.id, room.type)"
        >
          <b-overlay
            no-wrap
            variant="white"
            spinner-variant="primary"
            :show="ids_busy.includes(room.id)"
          />
          <b-avatar variant="dark" :src="room.avatar_url" class="mr-3"/>
          <div
            class="d-flex flex-column justify-content-start"
            style="flex-grow: 1;"
          >
            <span class="mr-auto">{{ room.name }}</span>
            <small class="text-muted">
              {{ room.id }} - {{ room.type || 'Untyped' }}
            </small>
          </div>
          <b-dropdown
            right
            no-caret
            variant="outline-primary"
          >
            <template v-slot:button-content><BIconThreeDots/></template>
            <b-dropdown-item @click.stop="room_open_with = room.id">
              Open with...
            </b-dropdown-item>
          </b-dropdown>
        </b-list-group-item>
      </b-list-group>
    </b-card>

    <b-modal
      scrollable
      hide-footer
      title="Open With"
      :visible="Boolean(room_open_with)"
      @hide="room_open_with = undefined"
    >
      <ClickableAppListGroup
        flush
        :account="id"
        @appclick="(id) => openRoom(room_open_with, id)"
      >
        <template v-slot:noapps-text>
          You have no apps. To add one, click on the dropdown in the upper
          right corner and press "Manage Apps."
        </template>
      </ClickableAppListGroup>
    </b-modal>
  </div>
</template>

<script>
import { state } from '@/worker-link'
// import { BIconPlusCircleFill } from 'bootstrap-vue'
import { BIconThreeDots } from 'bootstrap-vue'

import ClickableAppListGroup from '../components/apps/ClickableAppListGroup'

export default {
  components: { ClickableAppListGroup, BIconThreeDots },
  genbind: {
    rooms: {
      apply: ['id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenRoomList'],
      default: []
    }
  },
  data () {
    return {
      console,
      room_open_with: undefined,
      ids_busy: []
    }
  },
  computed: {
    id () {
      return this.$route.query.account
    }
  },
  methods: {
    openRoom (room, app) {
      console.log(`Opening ${room} with ${app}`)
      const self = this
      const promise = (async function () {
        const manifest = await state.channel.call_obj.net.kb1rd.apps
          .v0[self.id]
          .userapp[app]
          .manifest.listen()
        const entry = manifest.entry_points['net.kb1rd.openroom']
        if (!entry) {
          throw new TypeError('App does not have openroom entry')
        }

        const { token } = await state.channel.call_obj.net.kb1rd.apps
          .v0[self.id]
          .userapp[app]
          .entry['net.kb1rd.openroom']
          .setup({ room_id: room })

        const return_path = self.$router.resolve(`/_linkback/${token}`).href
        const url = entry.to.replace(
          '{{return}}',
          encodeURIComponent(
            window.location.origin + window.location.pathname + return_path
          )
        )
        window.open(url, '_blank')
      })()

      this.ids_busy.push(room)
      promise.then(
        (assoc) => undefined,
        (e) => {
          this.$bvModal.msgBoxOk(
            'An unknown error occured while trying to open the app.',
            {
              title: 'Cannot open app',
              okVariant: 'danger',
              centered: true
            }
          )
          console.error('Failed to open app', e)
        }
      ).then(() => this.ids_busy.splice(this.ids_busy.indexOf(room), 1))
    },
    openRoomInfer (room, type) {
      let promise
      if (type) {
        promise = state.channel.call_obj.net.kb1rd.apps
          .v0[this.id]
          .assoc[type]
          .listen()
      } else {
        promise = Promise.resolve(undefined)
      }
      this.ids_busy.push(room)
      promise.then(
        (assoc) => {
          if (assoc) {
            this.openRoom(room, assoc.to)
            return
          }
          this.$bvModal.msgBoxOk(
            'You have no app associated with this room type. Add one by ' +
              'pressing "Manage Apps" under the dropdown in the upper left ' +
              'corner next to your avatar.',
            {
              title: 'Cannot open app',
              okVariant: 'warning',
              centered: true
            }
          )
          console.warn(`No app associated with type ${type}`)
        },
        (e) => {
          this.$bvModal.msgBoxOk(
            'An error occured trying to find this room type association.',
            {
              title: 'Cannot open app',
              okVariant: 'danger',
              centered: true
            }
          )
          console.error('Failed to get assocaition', e)
        }
      ).then(() => this.ids_busy.splice(this.ids_busy.indexOf(room), 1))
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
