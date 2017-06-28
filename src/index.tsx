import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Store from './Store';
// import registerServiceWorker from './registerServiceWorker';
import './index.css';

// https://github.com/flatiron/director/issues/349 explains
// why I need the strange path.
import { Router } from 'director/build/director';
import { autorun, useStrict } from 'mobx';
// useStrict(true);

function startRouter(store: Store) {

  const baseUrl = process.env.PUBLIC_URL;
  console.log('baseUrl', baseUrl);

  // update state on url change
  let router = new Router();
  router.on(baseUrl + '/\\d+/\\d+/\\d+/([-a-z0-9]*)/(\\d+)?',
    (id, pageno) => store.setBookView(id, +pageno || 1));
  router.on(baseUrl + '/find/?', store.setFindView);
  router.on(baseUrl + '/', store.setLandingView);
  router.configure({
    notfound: () => store.setErrorView(),
    html5history: true
  });
  router.init();

  // update url on state changes
  autorun(() => {
    const path = baseUrl + store.currentPath;
    console.log('autorun', path, store.currentPath);
    if (path !== window.location.pathname) {
      console.log('push', path, window.location.pathname);
      window.history.pushState(null, '', path);
    }
  });

}

function startPersist(store: Store) {
  var persist = window.localStorage.getItem('settings');
  if (persist) {
    store.setPersist(persist);
  }
  autorun(() => {
    window.localStorage.setItem('settings', store.persist);
  });
}

const store = new Store();

startPersist(store);
startRouter(store);
window.addEventListener('resize', store.resize);

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
