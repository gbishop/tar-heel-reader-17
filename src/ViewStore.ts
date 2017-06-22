import { observable, computed, action, reaction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';

type PageTurnSize = 'normal' | 'medium' | 'large' | 'off';

export const fontScaleMax = 4;
export const textFontSizeSteps = 8;

class ViewStore {
  // base font size for the page, 2% of smaller screen dimension
  @computed get baseFontSize() {
    return Math.min(this.screen.width, this.screen.height) * 0.02;
  }
  // scale for book text
  @observable fontScale: number = 0;
  @action.bound setFontScale(s: number) {
    this.fontScale = s;
  }
  // font size of book text
  @computed get textFontSize() {
    return Math.pow(fontScaleMax, this.fontScale / (textFontSizeSteps - 1))
      * this.baseFontSize * 2.5;
  }
  // line height of book text
  @computed get textLineHeight() {
    return this.textFontSize * 1.2;
  }
  // size of page turn buttons
  @observable pageTurnSize: PageTurnSize = 'normal';
  @action.bound setPageTurnSize(value: string) {
    this.pageTurnSize = value as PageTurnSize;
  }
  // width of page turn buttons
  @computed get pageTurnWidth() {
    return this.baseFontSize * 6 * 0.8;
  }
  // visibility of the controls modal
  @observable controlsVisible: boolean = false;
  @action.bound toggleControlsVisible() {
    this.controlsVisible = !this.controlsVisible;
  }
  // screen dimensions updated on resize
  @observable screen = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  @action.bound resize() {
    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;
  }
  // json string to persist the state
  @computed get persist(): string {
    return JSON.stringify({
    });
  }
  // restore the state from json
  @action.bound setPersist(js: string) {
    // var v = JSON.parse(js);
  }
}

export default ViewStore;
