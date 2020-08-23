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

function timeout (promise, time) {
  return new Promise((resolve, reject) => {
    let done = false
    setTimeout(() => {
      if (!done) {
        reject(new Error('Timed out'))
      }
      done = true
    }, time)
    promise.then(
      (d) => {
        if (!done) {
          resolve(d)
        }
        done = true
      },
      (e) => {
        if (!done) {
          reject(e)
        }
        done = true
      }
    )
  })
}

async function setupWorkers () {
  for (const { name, func } of worker_setup_funcs) {
    let port
    try {
      port = await timeout(func(), 30000)
      if (!port) {
        throw new Error('Port is `undefined`')
      }
    } catch (e) {
      console.warn(`Failed to start ${name}`, e)
    }

    try {
      const chan = new rpc.RpcChannel((m, x) => port.postMessage(m, x))
      port.onmessage = (e) => chan.receive(e.data)

      await timeout(chan.call_obj.net.kb1rd.services.requestServices(
        { id: ['net', 'kb1rd', 'mxbindings'], versions: [[0, 2]] }
      ), 1000)
      await timeout(chan.call_obj.net.kb1rd.services.requestServices(
        { id: ['net', 'kb1rd', 'apps'], versions: [[0, 1]] }
      ), 1000)

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
