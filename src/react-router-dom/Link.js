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