import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import {commandMiddleware, enhanceCommandReducer} from "redux-commands";
import {initReducer} from "./redux/utils";
import {ReloadPostsCommand} from "./redux/commands/ReloadPostsCommand";

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const store = createStore(enhanceCommandReducer(initReducer), composeEnhancers(applyMiddleware(commandMiddleware)));

store.dispatch(new ReloadPostsCommand());
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
