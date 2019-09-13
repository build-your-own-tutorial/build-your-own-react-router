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

    componentDidMount() {
        history.listen((pathname) => {
            console.log('history change', pathname);
            this.setState({ location: { pathname } })
        })
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