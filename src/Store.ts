import { observable, computed, action, reaction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';
import { FindResult, fetchFind } from './FindResult';

type PageTurnSize = 'normal' | 'medium' | 'large' | 'off';

class Store {
  // the id of the book to read or '' for the landing page
  @observable bookid: string = '';
  // an observable promise for the book associated with bookid
  @observable bookP: IPromiseBasedObservable<Book>;
  // get the book without having to say bookP.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get book() { return this.bookP.value; }
  // the page number we're reading
  @observable pageno: number = 1;
  // number of pages in the book
  @computed get npages() { return this.book.pages.length; }

  // update the state typically from a URL
  @observable currentView: 'landing' | 'book' | 'find' | 'error' = 'landing';
  @action.bound setBookView(id: string, page: number) {
    this.currentView = 'book';
    this.bookid = id;
    this.pageno = page;
    console.log('set book view', this.bookid);
  }
  @action.bound setLandingView() {
    this.currentView = 'landing';
  }
  @action.bound setFindView() {
    console.log('setFindView', window.location.search);
    this.currentView = 'find';
    this.findQuery = window.location.search;
  }
  @action.bound setErrorView() {
    this.currentView = 'error';
  }
  // map the state to a url
  @computed get currentPath() {
    console.log('currentView', this.currentView);
    if (this.currentView === 'book') {
      console.log('this.bookid', this.bookid);
      console.log('this.bookP', this.bookP);
      if (!this.bookP) { 
        // trying to avoid a race condition
        return '';
      }
      if (this.bookid && this.book) {
        return `${this.book.link}` + (this.pageno > 1 ? `${this.pageno}` : '');
      } else {
        return '';
      }
    } else if (this.currentView === 'find') {
      return '/find/';
    } else {
      return '';
    }
  }
  // alternate picture and text
  @observable pictureTextMode: 'combined' | 'alternate' = 'combined';
  @action.bound setAlternatePictureText(mode: boolean) {
    if (!mode) {
      this.pictureTextMode = 'combined';
    } else {
      this.pictureTextMode = 'alternate';
    }
    if (this.pageno === 1) {
      this.pictureTextToggle = 'text';
    } else {
      this.pictureTextToggle = 'picture';
    }
  }
  @observable pictureTextToggle: 'picture' | 'text' = 'picture';

  // step to the next page
  @action.bound nextPage() {
    if (this.pictureTextMode === 'combined' && this.pageno <= this.npages) {
      this.pageno += 1;
    } else if (this.pictureTextMode === 'alternate' && this.pictureTextToggle === 'text') {
      this.pageno += 1;
      this.pictureTextToggle = 'picture';
    } else if (this.pictureTextMode === 'alternate' && this.pictureTextToggle === 'picture') {
      this.pictureTextToggle = 'text';
    }
  }
  // step back to previous page
  @action.bound backPage() {
    if (this.pictureTextMode === 'combined') {
      if (this.pageno > 1) {
        this.pageno -= 1;
      } else {
        this.pageno = this.npages + 1;
      }
    } else if (this.pictureTextMode === 'alternate' && this.pictureTextToggle === 'text') {
      if (this.pageno > 1) {
        this.pictureTextToggle = 'picture';
      } else {
        this.pictureTextToggle = 'text';
        this.pageno = this.npages + 1;
      }
    } else if (this.pictureTextMode === 'alternate' && this.pictureTextToggle === 'picture') {
      this.pageno -= 1;
      this.pictureTextToggle = 'text';
    }
  }
  // set the page number
  @action.bound setPage(i: number) {
    this.pageno = i;
    if (this.pageno === 1 && this.pictureTextMode === 'alternate') {
      this.pictureTextToggle = 'text';
    } else if (this.pictureTextMode === 'alternate') {
      this.pictureTextToggle = 'picture';
    }
  }

  // base font size for the page, 2% of smaller screen dimension
  @computed get baseFontSize() {
    return Math.min(this.screen.width, this.screen.height) * 0.02;
  }
  // scale for book text
  @observable fontScale: number = 0;
  @action.bound setFontScale(s: number) {
    this.fontScale = s;
  }
  // number of steps of font size
  readonly textFontSizeSteps = 8;
  // largest text font
  readonly fontScaleMax = 4;
  // font size of book text
  @computed get textFontSize() {
    return Math.pow(this.fontScaleMax, this.fontScale / (this.textFontSizeSteps - 1))
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
    console.log('controls', this.controlsVisible);
  }
  // Find related variables
  @observable findQuery: string = 'foo';
  // an observable promise for the find result associated with the findQuery
  @observable findP: IPromiseBasedObservable<FindResult>;
  // get the find result without having to say findP.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get find() { return this.findP.value; }

  // screen dimensions updated on resize
  @observable screen = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  @action.bound resize() {
    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;
  }
  // persistence version
  readonly persistVersion = 1;
  // json string to persist the state
  @computed get persist(): string {
    return JSON.stringify({
      version: this.persistVersion,
      pictureTextMode: this.pictureTextMode,
      fontScale: this.fontScale,
      pageTurnSize: this.pageTurnSize
    });
  }
  // restore the state from json
  @action.bound setPersist(js: string) {
    var v = JSON.parse(js);
    if (v.version === this.persistVersion) {
      this.pictureTextMode = v.pictureTextMode;
      this.fontScale = v.fontScale;
      this.pageTurnSize = v.pageTurnSize;
    }
  }
  // handle updating the book when the id changes
  fetchHandler: {};
  // handle updating the find result
  findHandler: {};

  constructor() {
    // fetch the book when the id changes
    // figure out when to dispose of this
    this.fetchHandler = reaction(
      () => this.bookid,
      (bookid) => {
        console.log('book reaction', bookid);
        if (bookid.length > 0) {
          this.bookP = fromPromise(fetchBook(bookid)) as
            IPromiseBasedObservable<Book>;
        }
      });
    this.findHandler = reaction(
      () => this.findQuery,
      (query) => {
        console.log('find reaction', query);
        this.findP = fromPromise(fetchFind(this.findQuery)) as
          IPromiseBasedObservable<FindResult>;
      });
  }
}

export default Store;
