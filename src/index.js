import Pjax from 'pjax'
import transitions from './transitions'


/**
 * States
 */
const STATES = {
  loading: '-page-loading',
  loaded:  '-page-loaded'
}


/**
 * Props
 */
const runtime = {
  pjax: null,
  container: null,
  fallback: null,
  transition: null,
  transitions: {},
  loading: null
}


/**
 * Start pager instance
 * @param {Object} opts 
 */
export default function(opts = {}) {

  // singleton
  if(runtime.pjax) return;

  // do not load pjax if browse from local files
  if(location.protocol === 'file:') {
    console.error('cannot load PJax on file:// protocol, please setup a web server')
    return
  }

  // set props
  runtime.container = opts.container || 'main'
  runtime.fallback = opts.transition || 'noop'
  runtime.transitions = Object.assign(transitions, opts.transitions)

  // set hooks
  runtime.beforeLoad = opts.beforeLoad
  runtime.afterLoad = opts.afterLoad
  runtime.beforeSwap = opts.beforeSwap
  runtime.afterSwap = opts.afterSwap

  // load the page
  document.addEventListener('pjax:send', onLoad)

  // handle error
  document.addEventListener('pjax:error', err => {
    console.error(err)
    location.href = err.request.responseURL
  })

  // instanciate pjax
  runtime.pjax = new Pjax({
    elements: 'a[href]:not([data-transition\\.skip]), form[action]',
    selectors: ['title', runtime.container],
    switches: {
      [runtime.container]: onSwap
    },
    cacheBust: false
  })

  // add initial class on body
  document.body.classList.add(STATES.loaded)
}


/**
 * Hook called when the page is loading
 * @param {Object} e 
 */
function onLoad(e) {

  // call hook
  if(runtime.beforeLoad) {
    runtime.beforeLoad()
  }

  // change body classes
  document.body.classList.remove(STATES.loaded)
  document.body.classList.add(STATES.loading)

  // resolve transition name (from event.transition or [data-transition] attribute or fallback)
  let name = runtime.fallback
  if(e.transition) {
    name = e.transition
  }
  else if(e.triggerElement && e.triggerElement.dataset.transition) {
    name = e.triggerElement.dataset.transition
  }

  // resolve transition scenario
  runtime.transition = runtime.transitions[name] || runtime.transitions[runtime.fallback]

  // start transition (assume promise)
  const el = document.querySelector(runtime.container)
  runtime.loading = runtime.transition.enter(el)

  // call hook
  if(runtime.afterLoad) {
    runtime.afterLoad()
  }
}


/**
 * Hook called to replace the DOM content
 * @param {HTMLElement} before 
 * @param {HTMLElement} after 
 * @return {Promise}
 */
function onSwap(before, after) {

  // call hook
  if(runtime.beforeSwap) {
    runtime.beforeSwap()
  }

  // when loading transition is done
  return runtime.loading.then(() => {

    // swap content
    before.innerHTML = after.innerHTML
    runtime.pjax.onSwitch()

    // scroll top
    scrollTo({ top: 0 })

    // change body classes
    document.body.classList.remove(STATES.loading)
    document.body.classList.add(STATES.loaded)

    // end transition (assume promise)
    const el = document.querySelector(runtime.container)
    return runtime.transition.leave(el).then(() => {

      // call hook
      if(runtime.afterSwap) {
        runtime.afterSwap()
      }
    })
  })
}


/**
 * Change url
 * @param {String} url
 * @param {Object} opts
 */
export function go(url, opts) {
  if(pjax) pjax.loadUrl(url, opts)
  else location.href = url
}