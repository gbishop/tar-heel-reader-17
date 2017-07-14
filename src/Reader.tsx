import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Controls from './Controls';
import ErrorMsg from './ErrorMsg';
import NavFrame from './NavFrame';
import { NavButton } from './NavFrame';

import './Reader.css';

const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');

function em(s: number) {
  return `${s}em`;
}

const Reader = observer(function Reader(props: {store: Store}) {
  const store = props.store;
  let page;

  if (store.bs.promise.state === 'pending') {
    return <h1>Loading</h1>;

  } else if (store.bs.promise.state === 'rejected') {
    console.log('store', store);
    return (
      <div>
        <ErrorMsg error={store.bs.promise.reason} />
        <p> /1 is the only functioning url right now</p>
      </div>
    );

  } else if (store.bs.promise.value.link !== store.bs.link) {
    return <h1>Waiting</h1>;
  }
  let next = {label: 'Next', icon: NextArrow, action: store.bs.nextPage};
  let back = {label: 'Back', icon: BackArrow, action: store.bs.backPage};
  if (store.bs.pageno === 1) {
    back.action = store.setPreBookView;
    page = <TitlePage store={store} />;
  } else if (store.bs.pageno <= store.bs.npages) {
    page = <TextPage store={store} />;
  } else {
    page = <ChoicePage store={store} />;
  }

  return (
    <div className="Reader">
      <NavFrame store={store} next={next} back={back} >
        {page}
      </NavFrame>
      <Controls store={props.store} />
    </div>
  );

});

interface PageProps {
  store: Store;
}

const TitlePage = observer(function TitlePage(props: PageProps) {
  const store = props.store;
  const page = store.bs.book.pages[1];
  const baseUrl = process.env.PUBLIC_URL;
  return (
    <div className="Reader_Page" >
      <div style={{fontSize: em(store.textFontSize)}}>
        <h1 className="Reader_Title">{store.bs.book.title}</h1>
        <p className="Reader_Author">{store.bs.book.author}</p>
      </div>
      <img
        className="Reader_Picture"
        src={baseUrl + page.url}
      />
    </div>
  );
});

const TextPage = observer(function TextPage(props: PageProps) {
  const store = props.store;
  const page = store.bs.book.pages[store.bs.pageno - 1];
  let pt = '';
  if (store.bs.pictureTextMode === 'alternate') {
    pt = ' ' + store.bs.pictureTextToggle + '-only';
  }
  const baseUrl = process.env.PUBLIC_URL;
  const showPic = store.bs.pictureTextMode === 'combined' || store.bs.pictureTextToggle === 'picture';
  const showText = store.bs.pictureTextMode === 'combined' || store.bs.pictureTextToggle === 'text';
  return (
    <div className="Reader_Page" >
      {showPic && <img
        key={page.url}
        className="Reader_Picture"
        src={baseUrl + page.url}
      />}
      {showText && (
        <div className="Reader_TextButtons" style={{fontSize: em(store.textFontSize)}}>
          <p style={{flex: 1, fontSize: em(2)}}>{page.text}</p>
        </div>
        )
      }
      <span className="Reader_PageNumber">
        {store.bs.pageno}
      </span>
    </div>
  );
});

const ChoicePage = observer(function ChoicePage(props: PageProps) {
  return <p>Choice Page</p>;
});

export default Reader;
