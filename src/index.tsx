import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Store from './Store';
// import registerServiceWorker from './registerServiceWorker';
import './index.css';

// https://github.com/flatiron/director/issues/349 explains
// why I need the strange path.
import createHistory from 'history/createBrowserHistory';

import { autorun, useStrict } from 'mobx';
useStrict(true);

// create the store
const store = new Store();

// create the history object
const history = createHistory({ basename: process.env.PUBLIC_URL});

// route based on the initial url
store.doRoute(history.location.pathname, history.location.search);

// update the state when the url changes
history.listen((location, action) => {
  if (action === 'POP') {
    store.doRoute(location.pathname, location.search);
  }
});

// update the url when the state changes
autorun(() => {
  const path = store.currentPath;
  if (path !== history.location.pathname + history.location.search) {
    if (history.location.pathname === '/find/' && history.location.search.length === 0) {
      history.replace(path);
    } else {
      history.push(path);
    }
  }
});

// restore state from persisted values
var persist = window.localStorage.getItem('THR17settings');
if (persist) {
  store.setPersist(persist);
}
// update the persisted data from state
autorun(() => {
  window.localStorage.setItem('THR17settings', store.persist);
});

// update the window size
window.addEventListener('resize', store.resize);

// Start the rendering process
ReactDOM.render(
  <div>
    <App store={store} />
    {/*<DevTools />*/}
  </div>,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
