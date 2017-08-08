import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views } from './Store';
import { BookView } from './Store';
import Controls from './Controls';
import NavFrame from './NavFrame';
import Menu from './Menu';
import loading from './Loading';
import Speech from './Speech';

import './Choose.css';

const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');

function em(s: number) {
  return `${s}em`;
}

@observer
class Choose extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const baseUrl = process.env.PUBLIC_URL;
    const msg = loading(store.cs.promise);
    if (msg) {
      return msg;
    }
    // all these calculations are in em units
    // estimate the size of the region for choices
    const width = store.screen.width / store.baseFontSize - 2 * store.pageTurnWidth;
    const height = store.screen.height / store.baseFontSize;

    // work out which ones to show
    // move to Styles
    const coverSize = 10; // em
    const coverMargin = 0.1; // em

    const fs = store.textFontSize;
    const size = fs * (coverSize + coverMargin);
    const nchoices = store.cs.nchoices;
    /*
     * nc w n
     *  1 1 1
     *  2 2 1
     *  3 2 2
     *  4 2 2
     *  5 3 2
     *  6 3 2
     *  7 3 3
     *  8 3 3
     *  9 3 3
     */
    const W = [1, 2, 2, 2, 3, 3, 3, 3, 3][Math.min(nchoices, 9) - 1];
    const N = [1, 1, 2, 2, 2, 2, 3, 3, 3][Math.min(nchoices, 9) - 1];
    const R = height > width ? W : N;
    const C = height > width ? N : W;
    const maxRows = Math.min(R, Math.max(1, Math.floor(height / size)));
    const maxCols = Math.min(C, Math.max(1, Math.floor(width / size)));
    const nVisible = maxRows * maxCols;
    let books = [];
    let views: BookView[] = [];
    for (let i = 0; i < nVisible; i++) {
      const book = store.cs.choose.books[(i + store.cs.visible) % store.cs.nchoices];
      const view: BookView = {
        view: Views.read,
        link: book.link,
        page: 1};
      if (i < nchoices) {
        const isSelected = i === store.cs.selected;
        views.push(view);
        books.push(
          <button
            key={book.ID}
            className="Choose_Cover"
            onClick={() => store.setCurrentView(view)
            }
            style={{
              width: em(width / maxCols - coverMargin * fs * (maxCols + 1)),
              height: em(height / maxRows - coverMargin * fs * (maxRows + 1)),
              margin: em(coverMargin),
              outline: isSelected ? 'red solid thick' : 'none'
            }}
          >
            <div
              style={{fontSize: em(store.textFontSize)}}
            >
              <h1 className="Choose_Title">{book.title}</h1>
              <p className="Choose_Author">{book.author}</p>
            </div>
            <img
              className="Choose_Picture"
              src={baseUrl + book.preview.url}
            />
            {isSelected && <Speech store={store} lang={book.language} text={book.title} />}
          </button>);
      } else {
        books.push(
          <div
            key={i}
            style={{
              width: em(width / maxCols - coverMargin * fs * (maxCols + 1)),
              height: em(height / maxRows - coverMargin * fs * (maxRows + 1)),
              margin: em(coverMargin)
            }}
          />);
      }
    }
    const M = store.ms.M;
    const next = {
      icon: NextArrow,
      label: nVisible < store.cs.nchoices ? M.next : '',
      action: () => store.cs.stepVisible(nVisible)};
    const back = {
      icon: BackArrow,
      label: nVisible < store.cs.nchoices ? M.back : '',
      action: () => store.cs.stepVisible(-nVisible)};
    const mover = () => {
      if (nVisible > 1 && store.cs.selected < nVisible - 1) {
        store.cs.setSelected(store.cs.selected + 1);
      } else if (nchoices > nVisible) {
        store.cs.stepVisible(nVisible);
      } else {
        store.cs.setSelected(0);
      }
    };
    const chooser = () => {
      const selected = Math.max(0, store.cs.selected);
      store.setCurrentView(views[selected]);
    };
    
    return (
      <div
        className="Choose"
        style={{backgroundColor: store.pageColor, color: store.textColor}}
      >
        <Menu store={store} modifiers="discrete gray"/>
        <NavFrame
          store={store}
          next={next}
          back={back}
          mover={mover}
          chooser={chooser}
        >
          <div
            className="Choose_Slider"
          >
            {books}
          </div>
          
        </NavFrame>
        <Controls store={store} />
      </div>
    );
  }
}

export default Choose;
