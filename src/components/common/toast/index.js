import Toast from "./Toast";

const obj = {};

obj.install = function (Vue) {
  const component = Vue.extend(Toast);
  const toast = new component();
  toast.$mount(document.createElement('div'));
  document.body.appendChild(toast.$el);
  Vue.prototype.$toast = toast;
};

export default obj;