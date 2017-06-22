import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Modal = require('react-modal');
const NextArrow = require('./NextArrow.png');
const BackArrow = require('./BackArrow.png');
import BookStore from './BookStore';
import ViewStore from './ViewStore';
// import SharedBook from './SharedBook';
import './Reader.css';

const Reader = observer(function Reader(props: {stores: [ BookStore, ViewStore ]}) {
  const [ bookstore, viewstore ] = props.stores;
  let page;
  if (bookstore.pageno === 1) {
    page = <TitlePage stores={props.stores} />;
  } else if (bookstore.pageno <= bookstore.npages) {
    page = <TextPage stores={props.stores} />;
  } else {
    page = <ChoicePage stores={props.stores} />;
  }
  return page;
});

interface PageProps {
  stores: [ BookStore, ViewStore ];
}

const TitlePage = observer(function TitlePage(props: PageProps) {
  return <p>Title Page</p>;
});

const TextPage = observer(function TextPage(props: PageProps) {
  const [ bookstore, viewstore ] = props.stores;
  const page = bookstore.book.pages[bookstore.pageno - 1];
  let textHeight = 3 * viewstore.textLineHeight;
  let imgStyle = {
    width: viewstore.screen.width,
    height: viewstore.screen.height - textHeight,
    objectFit: 'contain'
  };
  console.log('iS', imgStyle);
  return (
    <div className="book-page">
      <img src={'https://tarheelreader.org' + page.url} style={imgStyle} />
      <p className="caption" style={{fontSize: viewstore.textFontSize}} >{page.text}
      <button
        className="page-turn page-back"
        onClick={bookstore.backPage}
      >
        <img src={BackArrow} />Back
      </button>
      <button
        className="page-turn page-next"
        onClick={bookstore.nextPage}
      >
        <img src={NextArrow} />Next
      </button>
      </p>
      <Controls stores={props.stores} />
    </div>
  );
});

const ChoicePage = observer(function ChoicePage(props: PageProps) {
  return <p>Choice Page</p>;
});

interface ControlsProps {
  stores: [ BookStore, ViewStore ];
}

const Controls = observer(function Controls(props: ControlsProps) {
  const [ bookstore, viewstore ] = props.stores;
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
        onKeyHandle={bookstore.nextPage}
      />
      <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={bookstore.backPage}
      />
      <NRKeyHandler
        keyValue="Escape"
        onKeyHandle={viewstore.toggleControlsVisible}
      />
      <Modal 
        isOpen={viewstore.controlsVisible}
        contentLabel="Reading controls"
        style={customStyles}
      >
        <div className="controls">
          <h1>Reading controls</h1>
          <label>Font Size:&nbsp;
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={viewstore.fontScale}
              onChange={e => viewstore.setFontScale(+e.target.value)}
            />
          </label>
          <label>Page Turn Size:&nbsp;
            <select
              value={viewstore.pageTurnSize}
              onChange={e => viewstore.setPageTurnSize(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra">Extra Large</option>
            </select>
          </label>

          <button onClick={viewstore.toggleControlsVisible}>
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
