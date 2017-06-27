import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Modal = require('react-modal');
const NextArrow = require('./NextArrow.png');
const BackArrow = require('./BackArrow.png');
import Store from './Store';
import Controls from './Controls';
import NRKeyHandler from './NRKeyHandler';

// import SharedBook from './SharedBook';
import './Reader.css';

const Reader = observer(function Reader(props: {store: Store}) {
  let page;
  if (props.store.pageno === 1) {
    page = <TitlePage store={props.store} />;
  } else if (props.store.pageno <= props.store.npages) {
    page = <TextPage store={props.store} />;
  } else {
    page = <ChoicePage store={props.store} />;
  }
  return page;
});

interface PageProps {
  store: Store;
}

const TitlePage = observer(function TitlePage(props: PageProps) {
  const store = props.store;
  const page = store.book.pages[1];
  return (
    <div
      id="Reader"
      className={'title-page ' + 'buttons-' + store.pageTurnSize}
      style={{fontSize: store.textFontSize}}
    >
      <h1 id="title">{store.book.title}</h1>
      <p id="author">{store.book.author}</p>
      <img
        id="picture"
        src={'https://tarheelreader.org' + page.url}
      />
      <button
        className="nav"
        id="back"
        onClick={store.backPage}
      >
        <img src={BackArrow} />Back
      </button>
      <button
        className="nav"
        id="next"
        onClick={store.nextPage}
      >
        <img src={NextArrow} />Next
      </button>
      <NRKeyHandler
        keyValue={'ArrowRight'}
        onKeyHandle={store.nextPage}
      />
      <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={store.backPage}
      />
      <Controls store={props.store} />
    </div>
  );
});

const TextPage = observer(function TextPage(props: PageProps) {
  const store = props.store;
  const page = store.book.pages[store.pageno - 1];
  let pt = '';
  if (store.pictureTextMode === 'alternate') {
    pt = ' ' + store.pictureTextToggle + '-only';
  }
  return (
    <div
      id="Reader"
      className={'book-page ' + 'buttons-' + store.pageTurnSize + pt}
      style={{fontSize: store.textFontSize}}
    >
      <img
        id="picture"
        src={'https://tarheelreader.org' + page.url}
      />
      <div id="text" >
        {page.text}
      </div>
      <button
        className="nav"
        id="back"
        onClick={store.backPage}
      >
        <img src={BackArrow} />Back
      </button>
      <button
        className="nav"
        id="next"
        onClick={store.nextPage}
      >
        <img src={NextArrow} />Next
      </button>
      <div id="page-number">{store.pageno}</div>
      <NRKeyHandler
        keyValue={'ArrowRight'}
        onKeyHandle={store.nextPage}
      />
      <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={store.backPage}
      />
      <Controls store={props.store} />
    </div>
  );
});

const ChoicePage = observer(function ChoicePage(props: PageProps) {
  return <p>Choice Page</p>;
});

export default Reader;
