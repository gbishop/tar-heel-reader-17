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
useStrict(true);

function startRouter(store: Store) {

  const baseUrl = process.env.PUBLIC_URL;

  // update state on url change
  let router = new Router();
  router.on(baseUrl + '/:year/:month/:day/:slug/(\\d+)?',
    (year, month, day, slug, page) =>
    store.setCurrentView({
      view: 'book',
      link: `/${year}/${month}/${day}/${slug}/`,
      page: page ? +page : 1
    })
  );
  router.on(baseUrl + '/find/?',
    () => store.setCurrentView({
      view: 'find',
      query: window.location.search
    })
  );
  router.on(baseUrl + '/choose/?',
    () => store.setCurrentView({
      view: 'choose',
      query: window.location.search
    }));
  router.on(baseUrl + '/', 
    () => store.setCurrentView({ view: 'land' }));
  router.configure({
    notfound: () => store.setCurrentView({ view: 'land' }),
    html5history: true
  });
  router.init();

  // update url on state changes
  autorun(() => {
    const path = baseUrl + store.currentPath;
    if (path !== window.location.pathname + window.location.search) {
      if (window.location.pathname === '/find/' && window.location.search.length === 0) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
    }
  });

}

function startPersist(store: Store) {
  var persist = window.localStorage.getItem('THR17settings');
  if (persist) {
    store.setPersist(persist);
  }
  autorun(() => {
    window.localStorage.setItem('THR17settings', store.persist);
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
