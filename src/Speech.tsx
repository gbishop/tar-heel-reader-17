import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';

@observer
class Speech extends React.Component<{store: Store, text: string, lang: string}, {}> {
  getVoice(uri: string, lang: string) {
    const voices = window.speechSynthesis && window.speechSynthesis.getVoices() || [];
    var best: SpeechSynthesisVoice | null = null;
    var def: SpeechSynthesisVoice | null = null;
    for (var i = 0; i < voices.length; i++) {
      const v = voices[i];
      if (v.default) {
        def = v;
      }
      if (v.voiceURI === uri) {
        return v;
      }
      if (v.lang.slice(0, lang.length) === lang) {
        if (!best) {
          best = v;
        } else if (!best.localService && v.localService) {
          best = v;
        }
      }
    }
    return best || def;
  }
  render() {
    const { store, text, lang }  = this.props;
    if (!store.speak) {
      return null;
    }
    const bumpVoice = store.bumpVoice;
    const pv = store.preferredVoice;
    const voice = this.getVoice(pv[lang], lang);
    console.log('voice', voice);
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    if (voice) {
      msg.voice = voice;
    }
    msg.rate = store.speechRate;
    msg.pitch = store.speechPitch;
    speechSynthesis.speak(msg);
    console.log('speech', text, lang);
    return null;
  }
}

export default Speech;
