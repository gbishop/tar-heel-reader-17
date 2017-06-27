import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Modal = require('react-modal');
import Store from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';

import './Find.css';

const Find = observer(function Find(props: {store: Store}) {
  const store = props.store;
  if (store.findP.state === 'pending') {
    return <h1>Find loading</h1>;
  } else if (store.findP.state === 'rejected') {
    return <ErrorMsg error={store.findP.reason} />;
  } else {
    const findResults = store.find.books.map(b => (
      <li key={b.ID}>
        <img src={b.cover.url} />
        {b.title}
      </li>));
    return (
      <div id="find-page">
        <div id="find-form">
          Form goes here.
        </div>
        <div id="find-results">
          {findResults}
        </div>
        <Controls store={store} />
      </div>);
  }
});

export default Find;
