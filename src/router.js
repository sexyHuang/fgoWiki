import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
//import ServantList from './views/ServantList';
import ServantApi from './api/imp/ServantApi';
import CraftEssenceApi from './api/imp/CraftEssenceApi';
import store from '@/store';
Vue.use(Router);
let routerStack = sessionStorage.getItem('routerStack')
  ? JSON.parse(sessionStorage.getItem('routerStack'))
  : [];
let aliveList = [];
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        }

        resolve({ x: 0, y: 0 });
      }, 0);
    });
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/servantList',
      name: 'servantList',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/ServantList'),
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
        import(/* webpackChunkName: "about" */ './views/ServantInfo'),
      beforeEnter: async (to, from, next) => {
        console.log(to.params.ID);

        next();
      },
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/craftEssenceList',
      name: 'craftEssenceList',
      component: () => import('./views/CraftEssenceList.vue'),
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
      component: () => import('./views/CraftEssenceInfo/index.vue')
    },
    {
      path: '/treasureCalc',
      name: 'treasureCalc',
      component: () => import('./views/TreasureCalc'),
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
  ]
});
router.beforeEach(async (to, from, next) => {
  // ...
  if (routerStack.length === 0) {
    if (aliveList.indexOf(to.name) === -1) {
      aliveList.push(to.name);
    }
  }

  next();
});

router.afterEach((to, from) => {
  if (to.path !== from.path || !from.name) store.commit('setShowTitle', true);

  if (to.name === routerStack[routerStack.length - 1]) {
    // 后退
    store.commit('setIsBack', true);
    routerStack.pop();
    // 因为前进时，发现是要访问已经缓存过的路由，则会销毁缓存重新创建
    // 所以后退时（重新创建的也会在后退那一步删掉），缓存列表中不一定还有to路由
    // 如果后退过程中发现to在aliveList中是空的，就加入到aliveList中
    if (aliveList.indexOf(to.name) === -1) {
      aliveList.push(to.name);
    }
    removeFromAliveList(from.name);
  } else {
    store.commit('setIsBack', false);
    // 前进
    if (from.name) routerStack.push(from.name);
    // 前进时，发现是要访问已经缓存过的路由，销毁缓存重新创建
    if (aliveList.indexOf(to.name) !== -1) {
      removeFromAliveList(to.name);

      setTimeout(function() {
        aliveList.push(to.name);
      }, 0);
    }
  }
  store.commit('setCanGoBack', routerStack.length > 0);
  store.commit('setAliveList', aliveList);
  sessionStorage.setItem('routerStack', JSON.stringify(routerStack));
});

function removeFromAliveList(name) {
  const i = aliveList.indexOf(name);
  if (i !== -1) return aliveList.splice(i, 1); // aliveList即include属性中的列表
  return false;
}

export default router;
