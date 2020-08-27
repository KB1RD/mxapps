<template>
  <b-modal
    title="Add an App"
    scrollable
    :visible="true"
    @change="(v) => v === false ? $emit('exit') : undefined"
    ok-title="Add"
    :ok-disabled="Boolean(error || !response)"
    :busy="busy"
    @ok="addApp"
  >
    <template v-if="error">
      Failed to load app information. Double-check that you have the app's URL
      correct and try again.
    </template>
    <template v-else-if="response">
      <h1>{{ title }}</h1>
      <p class="text-muted">
        <b-badge variant="primary">
          v{{ response.manifest.version[0] }}
          .{{ response.manifest.version[1] }}
          .{{ response.manifest.version[2] }}
        </b-badge>
        {{ url }}
      </p>

      <h2 class="text-muted">Permissions</h2>
      <b-list-group>
        <b-list-group-item
          v-for="({ name, enabled_by }, i) in known_permissions"
          :key="name"
          class="d-flex flex-column justify-items-center"
        >
          <b-form-checkbox
            v-model="permission_values[i]"
            :disabled="permissions_disabled[i]"
            switch
          >
            {{ $t(`permissions/title/${name}`) }}
          </b-form-checkbox>
          <span class="text-muted font-small">
            {{ $t(`permissions/desc/${name}`) }}
          </span>
          <small v-if="permissions_disabled[i]" class="text-muted">
            Required to <em>{{
              enabled_by
                .filter((i) => permission_values[i])
                .map((i) => known_permissions[i].name)
                .map((n) => $t(`permissions/title/${n}`))
                .join(', ')
            }}</em>
          </small>
        </b-list-group-item>

        <b-list-group-item
          v-for="(perm, i) in response.unknown_permissions"
          :key="perm"
          variant="warning"
          class="d-flex flex-column justify-items-center"
        >
          <b-form-checkbox v-model="unknown_permission_values[i]" switch>
            {{ $t(`permissions/unknown`) }} '{{ perm }}'
          </b-form-checkbox>
          <span class="text-muted font-small">
            {{ $t(`permissions/unknown-desc`) }}
          </span>
        </b-list-group-item>
      </b-list-group>

      <template v-if="response.manifest.entry_points['net.kb1rd.openroom']">
        <h2 class="text-muted mt-3">Associations</h2>
        <b-form-checkbox
          v-for="
            type in response.manifest.entry_points['net.kb1rd.openroom'].types
          "
          v-model="associations"
          :key="type"
          :value="type"
          name="flavour-3a"
        >
          {{ $t(`associations/associatewith.{TYPE}`).replace('{TYPE}', type) }}
        </b-form-checkbox>
      </template>
    </template>
    <template v-else>
      <b-spinner
        style="width: 3rem; height: 3rem;"
        variant="primary"
        label="Downloading app manifest..."
      />
    </template>
  </b-modal>
</template>

<script>
import { state } from '@/worker-link'

/**
 * This is a fire-and-forget component: Once used, it should be discarded
 */
export default {
  props: { url: String, account: String },
  data () {
    return {
      busy: false,

      error: false,
      // This only works because the sub-properties do not have to be reactive
      // It's a little sketchy
      response: undefined,

      known_permissions: [],
      permissions_disabled: [],
      permission_values: [],

      unknown_permission_values: [],

      associations: []
    }
  },
  methods: {
    addApp (e) {
      e.preventDefault()
      const permissions = {}
      this.known_permissions.forEach((perm, i) => {
        permissions[perm.name] = this.permission_values[i]
      })
      this.response.unknown_permissions.forEach((perm, i) => {
        permissions[perm] = this.unknown_permission_values[i]
      })

      const self = this
      const promise = (async function () {
        await state.channel.call_obj.net.kb1rd.apps
          .v0[self.account]
          .userapp[self.url]
          .setup(self.response.manifest)
        await state.channel.call_obj.net.kb1rd.apps
          .v0[self.account]
          .userapp[self.url]
          .perms.set(permissions)
        await Promise.all(self.associations.map(
          (type) => state.channel.call_obj.net.kb1rd.apps
            .v0[self.account]
            .assoc[type]
            .set(self.url)
        ))
      })()
      this.busy = true
      promise.then(
        () => {
          this.$bvModal.msgBoxOk(`Added '${this.title}' to your account`, {
            title: 'Added App',
            okVariant: 'success',
            centered: true
          }).then(() => this.$emit('exit'))
        },
        (e) => {
          this.$bvModal.msgBoxOk(
            `An error occurred while trying to add '${this.title}' to your ` +
              'account.',
            {
              title: 'Failed to add app',
              okVariant: 'danger',
              centered: true
            }
          )
          console.error('Failed to add app', e)
        }
      ).then(() => (this.busy = false))
    }
  },
  computed: {
    /**
     * The worker **should** return the title stuff
     */
    title () {
      if (!this.response) {
        return undefined
      }
      const title = this.response.manifest.title
      return title['en-US'] || title.en || title[Object.keys(title)[0]]
    }
  },
  watch: {
    permission_values () {
      this.permission_values.forEach((enabled, i) => {
        const force = this.known_permissions[i].enabled_by.some(
          (i) => this.permission_values[i]
        )
        if (force && !enabled) {
          this.permission_values.splice(i, 1, true)
        }
        this.permissions_disabled.splice(i, 1, force)
      })
    }
  },
  mounted () {
    const promise = state.channel.call_obj.net.kb1rd.apps.v0
      .app[this.url]
      .fetchAndVerifyManifest()
    promise.then(
      (resp) => {
        this.response = resp

        const kp = resp.known_permissions
        const keys = Object.keys(kp)
        keys.forEach((name) => {
          if (!kp[name].enabled_by) {
            kp[name].enabled_by = []
          }
        })
        keys.forEach((name) => {
          kp[name].inherits.forEach((dep) => {
            kp[dep].enabled_by.push(name)
          })
        })
        this.known_permissions.push(...keys.map((name) => ({
          name,
          enabled_by: kp[name].enabled_by.map((k) => keys.indexOf(k))
        })))
        this.permission_values.push(...keys.map(() => false))
        this.permissions_disabled.push(...this.permission_values)

        this.unknown_permission_values.push(...resp.unknown_permissions.map(
          () => false
        ))
      },
      (err) => {
        this.error = err
        console.warn('Failed to load app manifest', err)
      }
    )
  }
}
</script>
