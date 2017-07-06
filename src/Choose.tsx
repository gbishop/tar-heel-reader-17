import * as React from 'react';
import { observer } from 'mobx-react';
import NRKeyHandler from './NRKeyHandler';
import Store from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';

const stars = {
  'Not yet rated': require('./icons/0stars.png'),
  '1 stars': require('./icons/1stars.png'),
  '1.5 stars': require('./icons/1.5stars.png'),
  '2 stars': require('./icons/2stars.png'),
  '2.5 stars': require('./icons/2.5stars.png'),
  '3 stars': require('./icons/3stars.png')
};

const reviewed = require('./icons/reviewed.png');
const caution = require('./icons/caution.png');
const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');

import './Choose.css';

const Choose = observer(function Choose(props: {store: Store}) {
  const store = props.store;
  if (!store.chooseP || store.chooseP.state === 'pending') {
    return <h1>Choices loading</h1>;
  } else if (store.chooseP.state === 'rejected') {
    return <ErrorMsg error={store.chooseP.reason} />;
  } else {
    const baseUrl = process.env.PUBLIC_URL;
    const b = store.choose.books[store.chooseIndex];
    return (
      <div
        id="Reader"
        className={'title-page ' + 'buttons-' + store.pageTurnSize}
        style={{fontSize: 1.8 * store.textFontSize}}
      >
        <p id="question">Would you like to read this book?</p>
        <h1 id="title">{b.title}</h1>
        <p id="author">{b.author}</p>
        <img
          id="picture"
          src={baseUrl + b.preview.url}
        />
        <button
          className="nav"
          id="back"
          onClick={store.nextChooseIndex}
        >
          <img src={BackArrow} />No
        </button>
        <button
          className="nav"
          id="next"
          onClick={e => store.setBookView(b.link, 2)}
        >
          <img src={NextArrow} />Yes
        </button>
        <NRKeyHandler
          keyValue={'ArrowRight'}
          onKeyHandle={e => store.setBookView(b.link, 2)}
        />
        <NRKeyHandler
          keyValue={'ArrowLeft'}
          onKeyHandle={store.nextChooseIndex}
        />
        <Controls store={store} />
      </div>
    );
  }
});

export default Choose;
