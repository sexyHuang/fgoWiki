## FGO WIKI

### 说明

> 该项目为基于 Vue + Vant-UI 实现的 fgo 基本数据展示和管理的应用。
> 应用数据全部来着网上，侵删。

### 技术选型

| 技术 | 说明 | 官网 |
| ---------- | ------------------ | ----------------------------------------- |
| Vue | 前端框架 | <a href="https://vuejs.org/">https://vuejs.org/</a> |
| Vue-router | 路由框架 | <a href="https://router.vuejs.org/">https://router.vuejs.org/</a> |
| Vuex | 全局状态管理框架 | <a href="https://vuex.vuejs.org/"> https://vuex.vuejs.org/</a> |
| Vant-Ui | 前端 UI 框架 | <a href="https://youzan.github.io/vant/">https://youzan.github.io/vant/</a> |
| Axios | 前端 HTTP 请求框架 | <a href="https://github.com/axios/axios">https://github.com/axios/axios</a> |
​
### 项目布局

```lua
    src -- 源码目录
    ├── api -- 基于axios打包的网络请求模块
    |   ├── config -- 参数
    |   ├── decorator -- 装饰器
    |   ├── imp -- 各类api实现
    |   ├── Api.js -- api实现类（有UI）
    |   └── BaseApi.js
    ├── assets -- 静态资源
    ├── library -- 通用方法
    |   ├── cache -- 缓存类
    |   ├── config -- 参数
    |   ├── common -- 通用方法
    |   ├── conf -- 其他参数
    |   └── treasureCalc -- 宝具伤害计算器
    ├── mixins -- 混合脚本
    ├── plugins -- 全局插件
    |   ├── globalFilters.js -- 全局过滤器
    |   ├── scroll.js -- 自定义指令scroll
    |   └── vant.js -- VantUI按需引入
    ├── components -- 组件库
    |   ├── SearchBar -- 搜索组件
    |   ├── CraftEssence.vue -- 礼装信息
    |   ├── fakeRow.vue -- 骨架
    |   ├── MaterialCalcResultList.vue -- 计算结果列表
    |   ├── MutiPicker.vue -- 复合选择器
    |   ├── PostBodyHeader.vue -- 帖子头部
    |   ├── MyRate.vue -- rate组件
    |   └── ServantListItem.vue -- 从者列表项
    ├── scss -- scss样式库
    |   ├── reset -- 初始化样式
    |   └── utils -- 通用样式
    ├── store -- 全局状态管理模块
    |   ├── module -- 模块化管理
    |   └── index.js -- 入口
    ├── router
    |   ├── module -- 路由模块
    |   ├── common.js -- 通用路由
    |   ├── globalGuard.js -- 全局路由守卫
    |   └── index.js -- 路由入口
    ├── views -- 页面
    |   |   -- 通用
    |   ├── Home.vue -- 首页
    |   ├── Login.vue -- 登录页
    |   ├── User.vue -- 用户页
    |   |   -- 从者
    |   ├── ServantList.vue -- 从者列表页
    |   ├── ServantInfo -- 从者信息页
    |   |   -- 礼装
    |   ├── CraftEssenceList.vue -- 礼装列表
    |   ├── CraftEssenceInfo -- 礼装页
    |   |   -- 素材
    |   ├── MaterialList.vue -- 素材列表页
    |   ├── MaterialDetail.vue -- 素材信息页
    |   |   -- 工具
    |   ├── MaterialUsed -- 素材使用统计页
    |   └── TreasureCalc -- 宝具伤害计算器
    ├── App.vue -- 入口组件
    ├── main.js -- 项目入口
    └── registerServiceWorker.js -- sw注册脚本   
```

### 常用配置

1. 配置打包目录 -> vue.config.js 下的 **outputDir** 属性；
2. 配置测试服务器代理 -> vue.config.js 下的 **devServer** 属性；

### 搭建步骤

- 下载 node 并安装：[https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi](https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi);
- 克隆源代码到本地，使用 IDEA 打开，并完成编译;
- 在 IDEA 命令行中运行命令：npm install,下载相关依赖;
- 在 IDEA 命令行中运行命令：npm run serve,运行项目;
- 在 IDEA 命令行中运行命令：npm run build, 打包项目到指定目录;
