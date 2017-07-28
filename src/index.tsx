import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Store, Views } from './Store';
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
      view: Views.book,
      link: `/${year}/${month}/${day}/${slug}/`,
      page: page ? +page : 1
    })
  );
  router.on(baseUrl + '/find/?',
    () => store.setCurrentView({
      view: Views.find,
      query: window.location.search
    })
  );
  router.on(baseUrl + '/choose/?',
    () => store.setCurrentView({
      view: Views.choose,
      query: window.location.search
    }));
  router.on(baseUrl + '/your-favorites/?',
    () => store.setCurrentView({
      view: Views.favorites
    }));
  router.on(baseUrl + '/', 
    () => store.setCurrentView({ view: Views.home }));
  router.configure({
    notfound: () => store.setCurrentView({ view: Views.home }),
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

const theStore = new Store();

startPersist(theStore);
startRouter(theStore);
window.addEventListener('resize', theStore.resize);

ReactDOM.render(
  <div>
    <App store={theStore} />
    {/*<DevTools />*/}
  </div>,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
