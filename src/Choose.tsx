import * as React from 'react';
import { observer } from 'mobx-react';
import NRKeyHandler from './NRKeyHandler';
import Store from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';
import NavFrame from './NavFrame';
import ContainerDimensions from 'react-container-dimensions';

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

@observer
class RenderBooks extends React.Component<RProps, {}> {
  render() {
    const baseUrl = process.env.PUBLIC_URL;
    const store = this.props.store;
    const width = this.props.width || 1;
    const height = this.props.height || 1;

    // work which ones to show
    let coverSize = 10; // em
    let coverMargin = 0.1; // em
    const topx = store.baseFontSize * store.textFontSize;
    const size = topx * (coverSize + coverMargin);
    const maxRows = Math.min(height > width ? 3 : 2, Math.max(1, Math.floor(height / size)));
    const maxCols = Math.min(height > width ? 2 : 3, Math.max(1, Math.floor(width / size)));
    const n = maxRows * maxCols;
    const books = store.choose.books.slice(0, n).map((book) => (
      <button
        key={book.ID}
        className="Choose_Cover"
        style={{
          width: width / maxCols - coverMargin * topx * (maxCols + 1),
          height: height / maxRows - coverMargin * topx * (maxRows + 1),
          margin: em(coverMargin)
        }}
      >
        <div>
          <h1 className="Choose_Title">{book.title}</h1>
          <p className="Choose_Author">{book.author}</p>
        </div>
        <img
          className="Choose_Picture"
          src={baseUrl + book.preview.url}
        />
      </button>));
    return (
      <div
        className="Choose_Slider"
        style={{fontSize: em(store.textFontSize)}}
      >
        {books}
      </div>);
  }
}

const Choose = observer(function Choose(props: {store: Store}) {
  const baseUrl = process.env.PUBLIC_URL;
  const store = props.store;
  if (!store.chooseP || store.chooseP.state === 'pending') {
    return <h1>Choices loading</h1>;
  } else if (store.chooseP.state === 'rejected') {
    return <ErrorMsg error={store.chooseP.reason} />;
  } else {
    const readit = () => 1;

    return (
      <div
        className="Choose"
      >
        <NavFrame
          store={store}
          next={{icon: NextArrow, label: 'Next', action: store.nextChooseIndex}}
          back={{icon: BackArrow, label: 'Read', action: readit}}
        >
        <ContainerDimensions>
          <RenderBooks store={store} />
        </ContainerDimensions>
        </NavFrame>
        <Controls store={store} />
      </div>
    );
  }
});

export default Choose;
