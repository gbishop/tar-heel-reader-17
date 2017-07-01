import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';
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
  console.log('pathname', window.location.pathname);

  // update state on url change
  let router = new Router();
  router.on(baseUrl + '/:year/:month/:day/:slug/(\\d+)?',
    (year, month, day, slug, page) =>
      store.setBookView(`/${year}/${month}/${day}/${slug}/`, page ? +page : 1));
  router.on(baseUrl + '/find/?', store.setFindView);
  router.on(baseUrl + '/', store.setLandingView);
  router.configure({
    notfound: () => store.setLandingView(),
    html5history: true
  });
  router.init();

  // update url on state changes
  autorun(() => {
    const path = baseUrl + store.currentPath;
    console.log('autorun', '|' + path + '|',
      '|' + window.location.pathname + window.location.search + '|');
    if (path !== window.location.pathname + window.location.search) {
      if (window.location.pathname === '/find/' && window.location.search.length === 0) {
        console.log('replace', path, window.location.pathname + window.location.search);
        window.history.replaceState(null, '', path);
      } else {
        console.log('push', path, window.location.pathname + window.location.search);
        window.history.pushState(null, '', path);
      }
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
  <div>
    <App store={store} />
    {/*<DevTools />*/}
  </div>,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
