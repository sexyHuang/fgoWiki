import Login from '@/views/Login';
import UserAPI from '@/api/imp/User';
import User from '@/views/User';
export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: async (to, from, next) => {
      try {
        await UserAPI.checkLogin();
      } catch (e) {
        console.log(e);
        next();
      }
    }
  },
  {
    path: '/user',
    name: 'user',
    component: User
  }
];
