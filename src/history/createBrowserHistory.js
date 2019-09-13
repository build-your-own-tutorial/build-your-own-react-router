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