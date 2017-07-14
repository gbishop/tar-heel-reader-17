import * as React from 'react';
import { observer } from 'mobx-react';
import NRKeyHandler from './NRKeyHandler';
import Store from './Store';
import { BookView } from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';
import NavFrame from './NavFrame';

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

function em(s: number) {
  return `${s}em`;
}

interface RProps {
  store: Store;
  width?: number;
  height?: number;
}

const Choose = observer(function Choose(props: {store: Store}) {
  const baseUrl = process.env.PUBLIC_URL;
  const store = props.store;
  if (!store.cs.promise || store.cs.promise.state === 'pending') {
    return <h1>Choices loading</h1>;
  } else if (store.cs.promise.state === 'rejected') {
    return <ErrorMsg error={store.cs.promise.reason} />;
  } else {
    const readit = () => 1;
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
        view: 'book',
        link: book.link,
        page: 1};
      if (i < nchoices) {
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
              outline: i === store.cs.selected ? 'red solid thick' : 'none'
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
    const next = {
      icon: NextArrow,
      label: nVisible < store.cs.nchoices ? 'Next' : '',
      action: () => store.cs.stepVisible(nVisible)};
    const back = {
      icon: BackArrow,
      label: nVisible < store.cs.nchoices ? 'Back' : '',
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
      >
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
      </div>);
  }
});

export default Choose;
