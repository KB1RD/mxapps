import * as rpc from 'rpcchannel'

const state = {
  active: false,
  failed: false,
  channel: undefined,

  /**
   * The active account that this tab is using
   */
  account: undefined
}

const worker_setup_funcs = [
  {
    name: 'SharedWorker',
    async func () {
      return new SharedWorker(
        '/mx-host-core-worker-sharedworker.min.js'
      ).port
    }
  }
]

async function setupWorkers () {
  for (const { name, func } of worker_setup_funcs) {
    let port
    try {
      port = await func()
      if (!port) {
        throw new Error('Port is `undefined`')
      }
    } catch (e) {
      console.warn(`Failed to start ${name}`, e)
    }

    try {
      const chan = new rpc.RpcChannel((m, x) => port.postMessage(m, x))
      port.onmessage = (e) => chan.receive(e.data)

      await chan.call_obj.net.kb1rd.services.requestServices(
        { id: ['net', 'kb1rd', 'mxbindings'], versions: [[0, 1]] }
      )

      state.channel = chan
      state.active = true
      state.failed = false
      return
    } catch (e) {
      state.failed = true
      throw e
    }
  }
  console.error('Reached end of available worker types. Setup failed.')
  state.failed = true
}

export { setupWorkers, state }
