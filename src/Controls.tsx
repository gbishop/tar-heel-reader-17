import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views } from './Store';
import Modal from 'react-modal';
import NRKeyHandler from './NRKeyHandler';
import { Tabs, Tab } from './Tabs';
import { Icon, Icons } from './Icons';

import './Controls.css';

@observer
class Controls extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const M = store.ms.M;
    const customStyles = {
      content : {
        top                   : '5%',
        left                  : '5%',
        right                 : 'auto',
        bottom                : 'auto',
      },
      overlay: {
        backgroundColor   : 'rgba(255, 255, 255, 0.0)'
      }
    };
    const voices = window.speechSynthesis && window.speechSynthesis.getVoices() || [];
    let voiceMap = {};
    const voiceOptions = voices.map((voice, i) => {
      voiceMap[voice.voiceURI] = voice;
      return <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>; });
    const lang = store.currentView === Views.read ? store.bs.book.language : store.ms.locale;

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
            <h1>{M.ReadingControls}
            <button className="Controls-Close" onClick={store.toggleControlsVisible}>
              <Icon icon={Icons.close} size={16} color="black" />
            </button></h1>
            <Tabs>
              <Tab title="Sizes">
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
              </Tab>
              <Tab title="Speech">
                <label>{M.SpeakText}: &nbsp;
                  <input
                    type="checkbox"
                    checked={store.speak}
                    onChange={store.toggleSpeak}
                  />
                </label>
                <label>{M.Voice}: &nbsp;
                  <select
                    value={store.preferredVoice.get(lang) || ''}
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
              </Tab>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Controls;
