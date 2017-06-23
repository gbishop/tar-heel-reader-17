import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Modal = require('react-modal');
const NextArrow = require('./NextArrow.png');
const BackArrow = require('./BackArrow.png');
import Store from './Store';

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
  const page = store.book.pages[store.pageno - 1];
  return (
    <div
      id="book-page"
      className={'title-page ' + 'buttons-' + store.pageTurnSize}
      style={{fontSize: store.textFontSize}}
    >
      <div id="button-positioner" />
      <button
        id="back"
        onClick={store.backPage}
      >
        <img src={BackArrow} />Back
      </button>
      <button
        id="next"
        onClick={store.nextPage}
      >
        <img src={NextArrow} />Next
      </button>
      <h1 id="title">{store.book.title}</h1>
      <p id="author">{store.book.author}</p>
      <img
        id="picture"
        src={'https://tarheelreader.org' + page.url}
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
      id="book-page"
      className={'buttons-' + store.pageTurnSize + pt}
      style={{fontSize: store.textFontSize}}
    >
      <div id="page-number">{store.pageno}</div>
      <div id="button-positioner" />
      <img
        id="picture"
        src={'https://tarheelreader.org' + page.url}
      />
      <button
        id="back"
        onClick={store.backPage}
      >
        <img src={BackArrow} />Back
      </button>
      <button
        id="next"
        onClick={store.nextPage}
      >
        <img src={NextArrow} />Next
      </button>
      <span
        id="text"
      >
        {page.text}
      </span>
      <Controls store={props.store} />
    </div>
  );
});

const ChoicePage = observer(function ChoicePage(props: PageProps) {
  return <p>Choice Page</p>;
});

const Controls = observer(function Controls(props: PageProps) {
  const store = props.store;
  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    },
    overlay: {
      backgroundColor   : 'rgba(255, 255, 255, 0.0)'
    }
  };

  return (
    <div>
      <NRKeyHandler
        keyValue={'ArrowRight'}
        onKeyHandle={store.nextPage}
      />
      <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={store.backPage}
      />
      <NRKeyHandler
        keyValue="Escape"
        onKeyHandle={store.toggleControlsVisible}
      />
      <Modal 
        isOpen={store.controlsVisible}
        contentLabel="Reading controls"
        style={customStyles}
      >
        <div className="controls">
          <h1>Reading controls</h1>
          <label>Font Size:&nbsp;
            <input
              type="range"
              min="0"
              max={store.textFontSizeSteps - 1}
              value={store.fontScale}
              onChange={e => store.setFontScale(+e.target.value)}
            />
          </label>
          <label>Alternate Picture and Text:&nbsp;
            <input
              type="checkbox"
              checked={store.pictureTextMode === 'alternate'}
              onChange={e => store.setAlternatePictureText(e.target.checked)}
            />
          </label>
          <label>Page Turn Size:&nbsp;
            <select
              value={store.pageTurnSize}
              onChange={e => store.setPageTurnSize(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="none">None</option>
            </select>
          </label>

          <button onClick={store.toggleControlsVisible}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
});

interface NRKeyHandlerProps {
  keyValue: string;
  onKeyHandle: (e: Event) => void;
}

@observer
class NRKeyHandler extends React.Component<NRKeyHandlerProps, void> {
  isDown = false;
  keyDown = (e: Event) => {
    e.preventDefault();
    if (!this.isDown) {
      this.isDown = true;
      this.props.onKeyHandle(e);
    }
  }
  keyUp = (e: Event) => {
    this.isDown = false;
  }
  render() {
    const keyValue = this.props.keyValue;
    return (
      <div>
        <KeyHandler
          keyEventName={'keydown'}
          keyValue={keyValue}
          onKeyHandle={this.keyDown}
        />
        <KeyHandler
          keyEventName={'keyup'}
          keyValue={keyValue}
          onKeyHandle={this.keyUp}
        />
      </div>
    );
  }
}

export default Reader;
