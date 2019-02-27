import Vue from 'vue';
import Router from 'vue-router';
import CommonRouters from './common';
import RouterConfig from './module';
import globalGuards from './globalGuards';

const scrollBehavior = (to, from, savedPosition) => {
  return new Promise(resolve => {
    //setTimeout(() => {
    if (savedPosition) {
      resolve(savedPosition);
    }

    resolve({ x: 0, y: 0 });
    // }, 0);
  });
};

//路由规则
const routes = [...RouterConfig, ...CommonRouters];

Vue.use(Router);
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior,
  routes
});
globalGuards(router);

export default router;
