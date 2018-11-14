const vuescroll = new Object();
const listeners = new Map();
vuescroll.install = (Vue, options) => {
  Vue.directive('scroll', {
    bind(el, binding, vnode, oldVnode) {
      let fun = ev => {
        binding.value(ev, el);
      };
      listeners.set(el, fun);
      window.addEventListener('scroll', fun);
    },
    unbind(el) {
      window.removeEventListener('scroll', listeners.get(el));
    }
  });
};
export default vuescroll;
