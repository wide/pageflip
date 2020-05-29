
/**
 * Promisified native animation
 * @param {HTMLElement} el 
 * @param {Array} keyframes 
 * @param {Number} duration 
 * @return {Promise}
 */
function animate(el, keyframes, duration = 300) {
  return new Promise(done => {
    const anim = el.animate(keyframes, { duration })
    anim.onfinish = done
  })
}


export default {
  
  // default transition, do nothing
  noop: {
    enter: el => Promise.resolve(),
    leave: el => Promise.resolve(),
  },

  // simple fade effect
  fade: {
    enter: el => animate(el, [{ opacity: 1 }, { opacity: 0 }]),
    leave: el => animate(el, [{ opacity: 0 }, { opacity: 1 }])
  }

}