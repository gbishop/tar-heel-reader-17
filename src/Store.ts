import { observable, computed, action, reaction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';

type PageTurnSize = 'normal' | 'medium' | 'large' | 'extra';

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
  @action.bound setIdPage(id: string, page: number) {
    this.bookid = id;
    this.pageno = page;
  }
  // map the state to a url
  @computed get currentPath() {
    return `/${this.bookid}` + (this.pageno > 1 ? `/${this.pageno}` : '');
  }
  // step to the next page
  @action.bound nextPage() {
    if (this.pageno <= this.npages) {
      this.pageno += 1;
    }
  }
  // step back to previous page
  @action.bound backPage() {
    if (this.pageno > 1) {
      this.pageno -= 1;
    } else {
      this.pageno = this.npages + 1;
    }
  }
  // set the page number
  @action.bound setPage(i: number) {
    this.pageno = i;
  }
  // font size of book text
  @observable fontScale: number = 1;
  @action.bound setFontScale(s: number) {
    this.fontScale = s;
  }
  @computed get fontBase() {
    return Math.min(this.screen.width, this.screen.height) * 0.02;
  }
  @computed get fontSize() {
    return this.fontScale * this.fontBase * 2.5;
  }
  // size of page turn buttons
  @observable pageTurnSize: PageTurnSize = 'normal';
  @action.bound setPageTurnSize(value: string) {
    this.pageTurnSize = value as PageTurnSize;
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
  // handle updating the book when the id changes
  fetchHandler: {};

  constructor() {
    // fetch the book when the id changes
    // figure out when to dispose of this
    this.fetchHandler = reaction(
      () => this.bookid,
      (bookid) => {
        if (this.bookid.length > 0) {
          this.bookP = fromPromise(fetchBook(`/api/book/${this.bookid}`)) as
            IPromiseBasedObservable<Book>;
        }
      });
  }
}

export default Store;
