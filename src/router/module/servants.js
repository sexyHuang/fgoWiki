import store from '@/store';
import ServantApi from '@/api/imp/ServantApi';
export default [
  {
    path: '/servantList',
    name: 'servantList',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/ServantList'),
    beforeEnter: async (to, from, next) => {
      if (store.state.servant.list.length === 0) {
        ServantApi.servantList().then(list => {
          store.commit('servant/setList', list);
          console.log('done');
        });
      }

      next();
    }
  },
  {
    path: '/servantInfo/:ID',
    name: 'servantInfo',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/ServantInfo'),
    beforeEnter: async (to, from, next) => {
      console.log(to.params.ID);

      next();
    },
    props: true
  }
];
