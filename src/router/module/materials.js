export default [
  {
    path: '/materialList',
    name: 'materialList',
    component: () => import('@/views/MaterialList')
  },
  {
    path: '/materialDetail/:ID',
    name: 'materialDetail',
    component: () => import('@/views/MaterialDetail')
  },
  {
    path: '/materialUsed',
    name: 'materialUsed',
    component: () => import('@/views/MaterialUsed')
  }
];
