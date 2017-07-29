import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Questions } from './Store';
import Controls from './Controls';
import NavFrame from './NavFrame';
import Menu from './Menu';
import loading from './Loading';
import Speech from './Speech';

import './Reader.css';

const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');

function em(s: number) {
  return `${s}em`;
}

@observer
class Reader extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    let page;
    const waitmsg = loading(store.bs.promise);
    if (waitmsg) {
      return waitmsg;
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
        <Controls store={store} />
      </div>
    );

  }
}

@observer
class TitlePage extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
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
          <Speech store={store} text={store.bs.book.title} lang={store.bs.book.language} />
        </div>
      </NavFrame>
    );
  }
}

@observer
class TextPage extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
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
          <Speech store={store} text={page.text} lang={store.bs.book.language} />
        </div>
      </NavFrame>
    );
  }
}

@observer
class ChoicePage extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const M = store.ms.M;
    const nop = () => {return; };
    let mover = nop;
    let chooser = nop;
    let click: (i: number) => void;
    let buttons;
    let question;
    switch (store.bs.question) {
      default:
      case Questions.what:
        mover =  () => store.bs.selectNext(3);
        click = (i: number) => {
          switch (i) {
            default:
              break;
            case 0:
              store.bs.setPage(1);
              store.bs.setQuestion(Questions.what);
              break;
            case 1:
              store.bs.setQuestion(Questions.rate);
              break;
            case 2:
              store.setPreBookView();
              store.bs.setQuestion(Questions.what);
              break;
          }
        };
        chooser = () => click(store.bs.selected);
        question = M.WhatNow;
        buttons = [ M.ReadAgain, M.Rate, M.Another ];
        break;
      case Questions.rate:
        mover = () => store.bs.selectNext(3);
        click = (i) => {
          if (i >= 0) {
            fetch(process.env.PUBLIC_URL +
              `/THR/api/rateajax/?id=${store.bs.book.ID}&rating=${i + 1}`);
            store.bs.setQuestion(Questions.thanks);
          }
        };
        question = M.HowRate;
        buttons = [ M.Rate1, M.Rate2, M.Rate3 ];
        chooser = () => click(store.bs.selected);
        break;
      case Questions.thanks:
        mover = () => store.bs.selectNext(2);
        click = (i: number) => {
          switch (i) {
            default:
              break;
            case 0:
              store.bs.setPage(1);
              store.bs.setQuestion(Questions.what);
              break;
            case 1:
              store.setPreBookView();
              store.bs.setQuestion(Questions.what);
              break;
          }
        };
        chooser = () => click(store.bs.selected);
        question = M.WhatNow;
        buttons = [ M.ReadAgain, M.Another ];
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
        {s && <Speech store={store} text={l} lang={store.ms.locale} />}
      </button>);
    return (
      <NavFrame store={store} mover={mover} chooser={chooser} >
        <div
          className="Reader_Page"
          style={{fontSize: em(store.textFontSize), justifyContent: 'space-around'}}
        >
        <h1>{question}</h1>
        <Speech store={store} text={question} lang={store.ms.locale} /> 
        {buttons.map((b, i) => abutton(b, () => click(i), i === store.bs.selected))}
        </div>;
      </NavFrame>
    );
  }
}

export default Reader;
