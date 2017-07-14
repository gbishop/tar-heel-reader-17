import * as React from 'react';
import { observer } from 'mobx-react';
import NRKeyHandler from './NRKeyHandler';
import Store from './Store';
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
    const maxRows = Math.min(height > width ? 3 : 2, Math.max(1, Math.floor(height / size)));
    const maxCols = Math.min(height > width ? 2 : 3, Math.max(1, Math.floor(width / size)));
    const nVisible = maxRows * maxCols;
    console.log(fs, size, width, height, nVisible, maxRows, maxCols);
    let books = [];
    for (let i = 0; i < nVisible; i++) {
      const book = store.cs.choose.books[(i + store.cs.visible) % store.cs.nchoices];
      books.push(
        <button
          key={book.ID}
          className="Choose_Cover"
          onClick={() => store.setCurrentView({
            view: 'book',
            link: book.link,
            page: 1})
          }
          style={{
            width: em(width / maxCols - coverMargin * fs * (maxCols + 1)),
            height: em(height / maxRows - coverMargin * fs * (maxRows + 1)),
            margin: em(coverMargin)
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
    }
    let next = {
      icon: NextArrow,
      label: nVisible < store.cs.nchoices ? 'Next' : '',
      action: () => store.cs.stepVisible(nVisible)};
    let back = {
      icon: BackArrow,
      label: nVisible < store.cs.nchoices ? 'Back' : '',
      action: () => store.cs.stepVisible(-nVisible)};
    
    return (
      <div
        className="Choose"
      >
        <NavFrame
          store={store}
          next={next}
          back={back}
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
