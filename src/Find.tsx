import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Modal = require('react-modal');
import Store from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';

const stars = {
  '0 stars': require('./icons/0stars.png'),
  '1 stars': require('./icons/1stars.png'),
  '1.5 stars': require('./icons/1.5stars.png'),
  '2 stars': require('./icons/2stars.png'),
  '2.5 stars': require('./icons/2.5stars.png'),
  '3 stars': require('./icons/3stars.png')
};

const reviewed = require('./icons/reviewed.png');

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
        <button onClick={e => store.setBookView(b.slug, 1)} >
          <img className="cover" src={store.fontScale <= 2 ? b.cover.url : b.preview.url} />
          <h1>{b.title}</h1>
          <p className="author">{b.author}</p>
          <img className="stars" src={stars[b.rating.text]} title={b.rating.text} />
          {b.reviewed && (<img src={reviewed} className="reviewed" />)}
          <p className="pages">{b.pages} pages</p>
        </button>
      </li>));
    return (
      <div
        id="Find"
        style={{fontSize: store.textFontSize / 1.8}}
      >
        <div id="find-form">
          Form goes here.
        </div>
        <ul id="Find-results">
          {findResults}
          <li style={{clear: 'both'}} />
        </ul>
        <Controls store={store} />
      </div>);
  }
});

export default Find;
