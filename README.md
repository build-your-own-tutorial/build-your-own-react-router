# 实现一个 react-router

本文将用尽可能容易理解的方式，实现最小可用的 [react-router v4](https://github.com/ReactTraining/react-router) 和 [history](https://github.com/ReactTraining/history)，目的为了了解 react-router 实现原理。

## 一、开始之前

在开始阅读本文之前，希望你至少使用过一次 react-router，知道 react-router 的基本使用方法。

## 二、已实现的功能

- 根据当前页面的 location.pathname，渲染对应 Route 中的 component
- 点击 Link，页面无刷新，pathname 更新，渲染对应 Route 中的 component
- 浏览器后退/前进，页面无刷新，渲染对应 Route 中的 component

## 三、Github 地址与在线预览

- GitHub 地址 [build-your-own-react-router](https://github.com/build-your-own-tutorial/build-your-own-react-router)
- 在线预览 [codesandbox](https://codesandbox.io/s/great-moon-09fn6)

## 四、更多
详细的分析文章请至 https://www.lvdawei.com/post/build-your-own-react-router/

------

觉得本项目帮助到你的话，请给我点个⭐️吧！
