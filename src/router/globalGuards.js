/*
 * @Author: Sexy
 * @Date: 2018-12-12 13:53:06
 * @LastEditors: Sexy
 * @LastEditTime: 2019-03-01 18:05:34
 * @Description: 全局路由守卫
 */

import store from '@/store';
let routerStack = sessionStorage.getItem('routerStack')
  ? JSON.parse(sessionStorage.getItem('routerStack'))
  : [];
let aliveList = [];
export default function globalGuards(router) {
  router.beforeEach(async (to, from, next) => {
    // ...
    if (routerStack.length === 0) {
      if (aliveList.indexOf(to.name) === -1) {
        aliveList.push(to.name);
      }
    }
    console.log('hook 1');
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
}

function removeFromAliveList(name) {
  const i = aliveList.indexOf(name);
  if (i !== -1) return aliveList.splice(i, 1); // aliveList即include属性中的列表
  return false;
}
