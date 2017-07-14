import { observable, computed, action, reaction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';
import { FindResult, fetchFind, fetchChoose } from './FindResult';
import { NavButtonStyle, navButtonStyles } from './Styles';

type ViewName = 'land' | 'book' | 'find' | 'choose' | 'error';

interface LandView {
  view: 'land';
}

export interface BookView {
  view: 'book';
  link: string;
  page: number;
}

interface FindView {
  view: 'find';
  query: string;
}

interface ChooseView {
  view: 'choose';
  ids: string;
}

interface ErrorView {
  view: 'error';
}

type View = LandView | BookView | FindView | ChooseView | ErrorView;

class BookStore {
  // the link of the book to read or '' for the landing page
  @observable link: string = '';
  // an observable promise for the book associated with bookid
  @observable promise: IPromiseBasedObservable<Book>;
  // get the book without having to say book.promise.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get book() { return this.promise.value; }
  // the page number we're reading
  @observable pageno: number = 1;
  // number of pages in the book
  @computed get npages() { return this.book.pages.length; }
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

  @action.bound setView(v: BookView) {
    this.link = v.link;
    this.pageno = v.page;
    this.pictureTextToggle = 'picture';
  }

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

  // handle updating the book when the id changes
  fetchHandler: {};
  constructor() {
    // fetch the book when the id changes
    // figure out when to dispose of this
    this.fetchHandler = reaction(
      () => this.link,
      (link) => {
        this.promise = fromPromise(fetchBook(link)) as IPromiseBasedObservable<Book>;
      });
  }
}

class FindStore {
  // Find related variables
  @observable query = {
    search: '',
    category: '',
    reviewed: 'R',
    audience: 'E',
    language: 'en',
    page: 1,
    count: 24
  };
  @computed get queryString() {
    let parts = [];
    const q = this.query;
    for (var p in q) {
      if (q.hasOwnProperty(p)) {
        parts.push(encodeURIComponent(p) + '=' + encodeURIComponent(this.query[p]));
      }
    }
    return parts.join('&');
  }
  // an observable promise for the find result associated with the fs.query
  @observable promise: IPromiseBasedObservable<FindResult>;
  // get the find result without having to say promise.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get find() { return this.promise.value; }
  // set the find view
  @action.bound setView(v: FindView) {
    const search = v.query.substring(1);
    this.queryWatch = true;
    if (search.length > 0) {
      const o = JSON.parse('{"' +
        decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
        '"}');
      for (var p in o) {
        if (this.query.hasOwnProperty(p)) { this.query[p] = o[p];
        }
      }
    }
  }

  // handle updating the find result
  findHandler: {};
  @observable queryWatch = false;
  constructor() {
    this.findHandler = reaction(
      () => [ this.queryString, this.queryWatch ],
      ([query, watch]) => {
        this.promise = fromPromise(fetchFind(this.queryString)) as
          IPromiseBasedObservable<FindResult>;
      });
  }
}

class ChooseStore {
  // list of book ids on the choose page
  @observable list: string[] = [];
  // index of the currently selected book
  @observable selected: number = -1;
  @action.bound setSelected(i: number) {
    this.selected = i % this.list.length;
    if (this.selected < 0) {
      this.selected += this.list.length;
    }
  }
  // index of the first visible book
  @observable visible: number = 0;
  @action.bound stepVisible(i: number) {
    const L = this.list.length;
    this.visible = (this.visible + i) % L;
    if (this.visible < 0) {
      this.visible += L;
    }
    this.selected = -1;
  }

  // an observable promise for the choose result
  @observable promise: IPromiseBasedObservable<FindResult>;
  @computed get choose() { return this.promise.value; }
  @computed get nchoices() { return this.choose.books.length; }

  @action.bound setView(v: ChooseView) {
    this.list = v.ids.split(',');
    this.visible = 0;
    this.selected = -1;
  }

  // handle updating choose result
  chooseHandler: {};

  constructor() {
    this.chooseHandler = reaction(
      () => this.list,
      (list) => {
        this.promise = fromPromise(fetchChoose(this.list)) as
          IPromiseBasedObservable<FindResult>;
      });
  }
}

class Store {
  public bs = new BookStore();
  public fs = new FindStore();
  public cs = new ChooseStore();
  
  // update the state typically from a URL
  @observable currentView: ViewName = 'land';
  @action.bound setCurrentView(v: View) {
    switch (v.view) {
      case 'land':
        this.currentView = 'land';
        break;
      case 'book':
        if (this.currentView === 'choose') {
          this.preBookView = 'choose';
        } else {
          this.preBookView = 'find';
        }
        this.currentView = 'book';
        this.bs.setView(v);
        break;
      case 'find':
        this.currentView = 'find';
        this.fs.setView(v);
        break;
      case 'choose':
        this.currentView = 'choose';
        this.cs.setView(v);
        break;
      default:
      case 'error':
        this.currentView = 'error';
        break;
    }
  }

  // set either Find or Choose view depending on where you were last
  // on going back to Choose bump the index
  @observable preBookView: 'find' | 'choose' = 'find';
  @action.bound setPreBookView() {
    if (this.preBookView === 'find') {
      this.setCurrentView({
        view: 'find',
        query: ''
      });
    } else if (this.preBookView === 'choose') {
      this.currentView = 'choose';
    }
  }

  // map the state to a url
  @computed get currentPath() {
    if (this.currentView === 'book') {
      return `${this.bs.link}` + (this.bs.pageno > 1 ? `${this.bs.pageno}` : '');
    } else if (this.currentView === 'find') {
      return '/find/?' + this.fs.queryString;
    } else if (this.currentView === 'choose') {
      return `/choose/${this.cs.list.join(',')}`;
    } else {
      return '/';
    }
  }
  // base font size for the page, 2% of smaller screen dimension
  @computed get baseFontSize() {
    return Math.max(this.screen.width, this.screen.height) * 0.02;
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
    return Math.pow(this.fontScaleMax, this.fontScale / (this.textFontSizeSteps - 1));
  }

  // size of page turn buttons
  @observable pageTurnSize: NavButtonStyle = 'normal';
  @action.bound setPageTurnSize(value: string) {
    if (value in navButtonStyles) {
      this.pageTurnSize = value as NavButtonStyle;
    }
  }
  @computed get pageTurnWidth() {
    const nbs = navButtonStyles[this.pageTurnSize];
    const w = parseFloat(nbs.width) * parseFloat(nbs.fontSize);
    console.log('ptw', this.pageTurnSize, w);
    return w;
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
  // persistence version
  readonly persistVersion = 2;
  // json string to persist the state
  @computed get persist(): string {
    return JSON.stringify({
      version: this.persistVersion,
      pictureTextMode: this.bs.pictureTextMode,
      fontScale: this.fontScale,
      pageTurnSize: this.pageTurnSize,
      query: this.fs.query
    });
  }
  // restore the state from json
  @action.bound setPersist(js: string) {
    var v = JSON.parse(js);
    if (v.version === this.persistVersion) {
      this.bs.pictureTextMode = v.pictureTextMode;
      this.fontScale = v.fontScale;
      this.pageTurnSize = v.pageTurnSize;
      this.fs.query.search = v.query.search;
      this.fs.query.category = v.query.category;
      this.fs.query.reviewed = v.query.reviewed;
      this.fs.query.audience = v.query.audience;
      this.fs.query.language = v.query.language;
      this.fs.query.page = v.query.page;
    }
  }
}

export default Store;
