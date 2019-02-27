import ServantApi from '@/api/imp/ServantApi';
import store from '@/store';
export default [
  {
    path: '/treasureCalc',
    name: 'treasureCalc',
    component: () => import('@/views/TreasureCalc'),
    beforeEnter: async (to, from, next) => {
      if (store.state.servant.list.length === 0) {
        ServantApi.servantList().then(list => {
          store.commit('servant/setList', list);
          console.log('done');
        });
      }
      if (store.state.servant.list4Treasure.length === 0) {
        ServantApi.servantListForTreasureCalc().then(list => {
          store.commit('servant/setList4Treasure', list);
        });
      }
      next();
    }
  }
];
