const vuescroll = new Object();
const listeners = new Map();
vuescroll.install = (Vue) => {
  Vue.directive('scroll', {
    bind(el, binding) {
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
