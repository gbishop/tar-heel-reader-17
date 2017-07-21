import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Modal from 'react-modal';
import NRKeyHandler from './NRKeyHandler';

import './Controls.css';

const Controls = observer(function Controls(props: {store: Store}) {
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
  const voices = window.speechSynthesis && window.speechSynthesis.getVoices() || [];
  let voiceMap = {'silent': { voiceURI: 'silent' }};
  const voiceOptions = voices.map((voice, i) => {
    voiceMap[voice.voiceURI] = voice;
    return <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>; });

  return (
    <div>
      <NRKeyHandler
        keyValue="Escape"
        onKeyHandle={store.toggleControlsVisible}
      />
      <Modal
        isOpen={store.controlsVisible}
        contentLabel="Reading controls"
        style={customStyles}
      >
        <div className="Controls">
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
              checked={store.bs.pictureTextMode === 'alternate'}
              onChange={e => store.bs.setAlternatePictureText(e.target.checked)}
            />
          </label>
          <label>Button Size:&nbsp;
            <select
              value={store.pageTurnSize}
              onChange={e => store.setPageTurnSize(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="off">None</option>
            </select>
          </label>
          <label>Voice: &nbsp;
            <select
              value={store.voice && store.voice.voiceURI || 'silent'}
              onChange={e => store.setVoice(voiceMap[e.target.value])}
            >
              <option value="silent">Silent</option>
              {voiceOptions}
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

export default Controls;
