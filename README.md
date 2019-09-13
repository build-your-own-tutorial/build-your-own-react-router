# 实现一个 react-router

本项目将用尽可能容易理解的方式，实现最小可用的 [react-router v4](https://github.com/ReactTraining/react-router) 和 [history](https://github.com/ReactTraining/history)，目的为了了解 react-router 实现原理。

## 一、前置条件

你必须至少使用过一次 react-router，知道 react-router 的简单使用方法。

## 二、已实现的功能

- 点击 Link，页面无刷新渲染
- 浏览器后退/前进，页面无刷新渲染

## 三、在线预览

[codesandbox](https://codesandbox.io/s/great-moon-09fn6)

## 四、原理分析

### 1. Route

先来看一段代码，我们需要实现的逻辑是：当 location.pathname='/' 时，页面渲染 Index 组件，而当 location.path='/about/' 时，页面渲染 About。

```jsx
import React from 'react';

import { BrowserRouter as Router, Route, Link } from "./react-router-dom";

function Index(props) {
  console.log('Index props', props);
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default App;
```

其实，Route 组件内部的核心逻辑就是判断当前 pathname 是否与自身 props 上的 path 相等，如果相等，则渲染自身 props 上的 component，不等的时候不渲染返回 null。

好，来看下 Route 的实现：

```js
import React from 'react';
import { RouterContext } from './BrowserRouter';

export default class Route extends React.Component {
    render() {
        const { path, component } = this.props;
        if (this.context.location.pathname !== path) return null;
        return React.createElement(component, { ...this.context })
    }
}

Route.contextType = RouterContext
```

Route 主要就是一个 render() 函数，内部通过 [context](https://reactjs.org/docs/context.html#classcontexttype) 获得当前 pathname。那么这个 context 是哪来的呢？

### 2. BrowserRouter

```jsx
import React from 'react';
import { createBrowserHistory } from '../history';

const history = createBrowserHistory()

export const RouterContext = React.createContext(history)

export default class BrowserRouter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: {
                pathname: window.location.pathname
            }
        }
    }

    render() {
        const { location } = this.state;
        return (
            <RouterContext.Provider value={{ history, location }}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
};
```

这里仅贴出了部分代码，包含首次渲染的逻辑。BrowserRouter 在 constructor 中初始化 pathname。这里给 pathname 包装了一层 location 对象，是为了和 react-router 的 API 保存一致。然后将 location 传入 RouterContext.Provider 组件，子组件 Route 接收到含有 location 的 context，完成首次渲染。

注意到传入 RouterContext.Provider 组件的对象不光有 location，还有 history 对象。这个 history 是做什么用的呢？其实是提供给子组件做跳转使用的，还用来实现 Link 组件。我们接着往下看。

### 3. Link

```jsx
import React from 'react';
import { RouterContext } from './BrowserRouter';

export default class Link extends React.Component {
    constructor(props) {
        super(props)
        this.clickHandler = this.clickHandler.bind(this)
    }

    clickHandler(e) {
        console.log('click', this.props.to);
        e.preventDefault()
        this.context.history.push(this.props.to)
    }

    render() {
        const { to, children } = this.props;
        return <a href={to} onClick={this.clickHandler}>{children}</a>
    }
}

Link.contextType = RouterContext
```

Link 组件其实就是一个 a 标签，只不过点击 Link 组件并不会刷新页面，组件内部把 href 的默认行为 preventDefault 了，Link 组件从 context 上拿到 history，将需要跳转的地址 push 到 history 内部，改变 location。

BrowserRouter 在 componentDidMount 中，通过 history.listen 监听 location 的变化。当 location 变化的时候，setState 一个新的 location 对象，触发 render，进而触发子组件 Route 的重新渲染，进入上文 `1. Route` 的流程。

```jsx
// BrowserRouter
componentDidMount() {
    history.listen((pathname) => {
        console.log('history change', pathname);
        this.setState({ location: { pathname } })
    })
}
```

### history

history 的内部实现是怎么样的呢？请看下面的代码：

```js
let globalHistory = window.history;

export default function createBrowserHistory() {
    let listeners = []

    const push = function (pathname) {
        globalHistory.pushState({}, '', pathname)
        notifyListeners(pathname)
    }

    const listen = function (listener) {
        listeners.push(listener)
    }

    const notifyListeners = (...args) => {
        listeners.forEach(listener => listener(...args))
    }

    window.onpopstate = function () {
        notifyListeners(window.location.pathname)
    }

    return {
        listeners,
        listen,
        push
    }
};
```

history 内部通过 listen 方法收集外部的订阅事件，当外部调用 history.push 方法的时候，window.history.pushState 修改当前 location，notifyListeners 依次回调 listener。这里为了让流程更加容易理解，简化了 listener this 的处理。

另外，window.onpopstate 用来监听浏览器的前进后退事件，同样通知回调 listener，刷新对应 Route 组件。





