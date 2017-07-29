import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';

@observer
class Speech extends React.Component<{store: Store, text: string, lang: string}, {}> {
  render() {
    const { store, text, lang }  = this.props;
    if (!store.speak) {
      return null;
    }
    const voice = store.getVoice(lang);
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    if (voice) {
      msg.voice = voice;
    }
    msg.rate = store.speechRate;
    msg.pitch = store.speechPitch;
    speechSynthesis.speak(msg);
    return null;
  }
}

export default Speech;
