import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Modal from 'react-modal';
import NRKeyHandler from './NRKeyHandler';

import './Controls.css';

const Controls = observer(function Controls(props: {store: Store}) {
  const store = props.store;
  const M = store.ms.M;
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
  console.log('voices', voices);
  let voiceMap = {};
  const voiceOptions = voices.map((voice, i) => {
    voiceMap[voice.voiceURI] = voice;
    return <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>; });
  const lang = store.currentView === 'book' ? store.bs.book.language : store.ms.locale;
  // const preferredVoice = (store.preferredVoice[lang] && store.preferredVoice[lang].voiceURI) || '';
  console.log('controls', lang, store.preferredVoice[lang]);

  return (
    <div>
      <NRKeyHandler
        keyValue="Escape"
        onKeyHandle={store.toggleControlsVisible}
      />
      <Modal
        isOpen={store.controlsVisible}
        contentLabel={M.ReadingControls}
        style={customStyles}
      >
        <div className="Controls">
          <h1>Reading controls</h1>
          <label>{M.FontSize}:&nbsp;
            <input
              type="range"
              min="0"
              max={store.textFontSizeSteps - 1}
              value={store.fontScale}
              onChange={e => store.setFontScale(+e.target.value)}
            />
          </label>
          <label>{M.AlternatePictureAndText}:&nbsp;
            <input
              type="checkbox"
              checked={store.bs.pictureTextMode === 'alternate'}
              onChange={e => store.bs.setAlternatePictureText(e.target.checked)}
            />
          </label>
          <label>{M.ButtonSize}:&nbsp;
            <select
              value={store.baseFontSize}
              onChange={e => store.setPageTurnSize(e.target.value)}
            >
              <option value="normal">{M.normal}</option>
              <option value="medium">{M.medium}</option>
              <option value="large">{M.large}</option>
              <option value="off">{M.off}</option>
            </select>
          </label>
          <label>Speak text: &nbsp;
            <input
              type="checkbox"
              checked={store.speak}
              onChange={store.toggleSpeak}
            />
          </label>
          <label>{M.Voice}: &nbsp;
            <select
              value={store.preferredVoice[lang]}
              onChange={e => store.setPreferredVoice(lang, e.target.value)}
            >
              <option value="">{M.Default}</option>
              {voiceOptions}
            </select>
          </label>
          <label>{M.SpeechRate}: &nbsp;
              <input
                value={store.speechRate}
                type="range"
                min={0.1}
                max={2}
                step={0.3}
                onChange={e => store.setSpeechRate(+e.target.value)}
              />
          </label>
          <label>{M.SpeechPitch}: &nbsp;
              <input
                value={store.speechPitch}
                type="range"
                min={0}
                max={2}
                step={0.25}
                onChange={e => store.setSpeechPitch(+e.target.value)}
              />
          </label>
          <button onClick={store.toggleControlsVisible}>
            {M.Close}
          </button>
        </div>
      </Modal>
    </div>
  );
});

export default Controls;
