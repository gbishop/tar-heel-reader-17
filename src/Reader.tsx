import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Controls from './Controls';
import ErrorMsg from './ErrorMsg';
import NavFrame from './NavFrame';
import Menu from './Menu';

import './Reader.css';
import './Loading.css';

const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');

function em(s: number) {
  return `${s}em`;
}

const Reader = observer(function Reader(props: {store: Store}) {
  const store = props.store;
  let page;

  if (store.bs.promise.state === 'pending') {
    return <p className="loading"/>;

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
  if (store.bs.pageno === 1) {
    page = <TitlePage store={store} />;
  } else if (store.bs.pageno <= store.bs.npages) {
    page = <TextPage store={store} />;
  } else {
    page = <ChoicePage store={store} />;
  }

  return (
    <div className="Reader">
      <Menu store={store} modifiers="gray discrete" />
      {page}
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
  let next = {label: 'Next', icon: NextArrow, action: store.bs.nextPage};
  let back = {label: 'Back', icon: BackArrow, action: store.setPreBookView};
  return (
    <NavFrame store={store} next={next} back={back} >
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
    </NavFrame>
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
  const showPic = store.bs.pictureTextMode === 'combined' ||
    store.bs.pictureTextToggle === 'picture';
  const showText = store.bs.pictureTextMode === 'combined' ||
    store.bs.pictureTextToggle === 'text';
  let next = {label: 'Next', icon: NextArrow, action: store.bs.nextPage};
  let back = {label: 'Back', icon: BackArrow, action: store.bs.backPage};
  return (
    <NavFrame store={store} next={next} back={back} >
      <div className="Reader_Page" >
        {showPic && <img
          key={page.url}
          className="Reader_Picture"
          src={baseUrl + page.url}
        />}
        {showText && (
          <div style={{fontSize: em(store.textFontSize)}}>
            <p style={{flex: 1, fontSize: em(2)}}>{page.text}</p>
          </div>
          )
        }
        <span className="Reader_PageNumber">
          {store.bs.pageno}
        </span>
      </div>
    </NavFrame>
  );
});

const ChoicePage = observer(function ChoicePage(props: PageProps) {
  const store = props.store;
  const nop = () => {return; };
  let mover = nop;
  let chooser = nop;
  let click: (i: number) => void;
  let buttons;
  let question;
  switch (store.bs.step) {
    default:
    case 'what':
      mover =  () => store.bs.selectNext(3);
      click = (i: number) => {
        switch (i) {
          default:
            break;
          case 0:
            store.bs.setPage(1);
            store.bs.setStep('what');
            break;
          case 1:
            store.bs.setStep('rate');
            break;
          case 2:
            store.setPreBookView();
            store.bs.setStep('what');
            break;
        }
      };
      chooser = () => click(store.bs.selected);
      question = 'What would you like to do now?';
      buttons = [ 'Read this book again', 'Rate this book', 'Choose another book' ];
      break;
    case 'rate':
      mover = () => store.bs.selectNext(3);
      click = (i) => {
        if (i >= 0) {
          console.log('rate book', i + 1);
          store.bs.setStep('thanks');
        }
      };
      question = 'How do you rate this book?';
      buttons = [ '1 star', '2 stars', '3 stars' ];
      chooser = () => click(store.bs.selected);
      break;
    case 'thanks':
      mover = () => store.bs.selectNext(2);
      click = (i: number) => {
        switch (i) {
          default:
            break;
          case 0:
            store.bs.setPage(1);
            store.bs.setStep('what');
            break;
          case 1:
            store.setPreBookView();
            store.bs.setStep('what');
            break;
        }
      };
      chooser = () => click(store.bs.selected);
      question = 'What would you like to do now?';
      buttons = [ 'Read this book again', 'Choose another book' ];
      break;
  }
  const abutton = (l: string, a: () => void, s: boolean) => (
    <button
      key={l}
      className="Reader_Choice"
      onClick={a}
      style={{outline: s ? 'red solid thick' : 'none'}}
    >
      {l}
    </button>);
  return (
    <NavFrame store={store} mover={mover} chooser={chooser} >
      <div
        className="Reader_Page"
        style={{fontSize: em(store.textFontSize), justifyContent: 'space-around'}}
      >
      <h1>{question}</h1>
      {buttons.map((b, i) => abutton(b, () => click(i), i === store.bs.selected))}
      </div>;
    </NavFrame>
  );
});

export default Reader;
