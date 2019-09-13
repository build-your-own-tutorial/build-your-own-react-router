
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