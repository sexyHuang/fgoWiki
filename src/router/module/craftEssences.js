import store from '@/store';
import CraftEssenceApi from '@/api/imp/CraftEssenceApi';
export default [
  {
    path: '/craftEssenceList',
    name: 'craftEssenceList',
    component: () => import('@/views/CraftEssenceList.vue'),
    beforeEnter: async (to, from, next) => {
      if (store.state.craftessence.list.length === 0) {
        await CraftEssenceApi.list().then(res => {
          store.commit('craftessence/setData', res);
          console.log('done');
        });
      }

      next();
    }
  },
  {
    path: '/craftEssenceInfo/:ID',
    name: 'craftEssenceInfo',
    component: () => import('@/views/CraftEssenceInfo')
  }
];
