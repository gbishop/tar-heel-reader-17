import * as React from 'react';
import { observer } from 'mobx-react';
import KeyHandler from 'react-key-handler';
import Store from './Store';

interface NRKeyHandlerProps {
  keyValue: string | string[];
  onKeyHandle: (e: Event) => void;
  store: Store;
}

@observer
class NRKeyHandler extends React.Component<NRKeyHandlerProps, {}> {
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
    let keyValues: string[] = [];
    keyValues = keyValues.concat(this.props.keyValue);
    const handlers = keyValues.map(keyValue => (
      <div key={keyValue} >
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
      </div>)
    );
    return !this.props.store.controlsVisible && <div>{handlers}</div>;
  }
}

export default NRKeyHandler;
