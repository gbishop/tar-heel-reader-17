import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
const NextArrow = require('./NextArrow.png');
const BackArrow = require('./BackArrow.png');
import Store from './Store';
import Controls from './Controls';
import NRKeyHandler from './NRKeyHandler';
import ErrorMsg from './ErrorMsg';

// import SharedBook from './SharedBook';
import './Reader.css';

const Reader = observer(function Reader(props: {store: Store}) {
  const store = props.store;
  let page;

  if (store.bookP.state === 'pending') {
    return <h1>Loading</h1>;

  } else if (store.bookP.state === 'rejected') {
    console.log('store', store);
    return (
      <div>
        <ErrorMsg error={store.bookP.reason} />
        <p> /1 is the only functioning url right now</p>
      </div>
    );

  } else if (store.bookP.value.link !== store.booklink) {
    return <h1>Waiting</h1>;
  }
  if (store.pageno === 1) {
    page = <TitlePage store={store} />;
  } else if (store.pageno <= store.npages) {
    page = <TextPage store={store} />;
  } else {
    page = <ChoicePage store={store} />;
  }
  return page;
});

interface PageProps {
  store: Store;
}

const TitlePage = observer(function TitlePage(props: PageProps) {
  const store = props.store;
  const page = store.book.pages[1];
  const baseUrl = process.env.PUBLIC_URL;
  return (
    <div
      id="Reader"
      className={'title-page ' + 'buttons-' + store.pageTurnSize}
      style={{fontSize: 1.8 * store.textFontSize}}
    >
      <h1 id="title">{store.book.title}</h1>
      <p id="author">{store.book.author}</p>
      <img
        id="picture"
        src={baseUrl + page.url}
      />
      <button
        className="nav"
        id="back"
        onClick={store.setFindView}
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
        onKeyHandle={store.setFindView}
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
  const baseUrl = process.env.PUBLIC_URL;
  return (
    <div
      id="Reader"
      className={'book-page ' + 'buttons-' + store.pageTurnSize + pt}
      style={{fontSize: 1.8 * store.textFontSize}}
    >
      <img
        id="picture"
        src={baseUrl + page.url}
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
