import { observable, computed, action } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';
import { FindResult, fetchFind, fetchChoose } from './FindResult';
import { NavButtonStyle, navButtonStyles } from './Styles';

type ViewName = 'home' | 'book' | 'find' | 'choose' | 'error' | 'settings';

interface HomeView {
  view: 'home';
}

export interface BookView {
  view: 'book';
  link: string;
  page: number;
}

interface FindView {
  view: 'find';
  query?: string;
}

interface ChooseView {
  view: 'choose';
  query?: string;
}

interface ErrorView {
  view: 'error';
}

interface SettingsView {
  view: 'settings';
}

type View = HomeView | BookView | FindView | ChooseView | ErrorView | SettingsView;

type Steps = 'what' | 'rate' | 'thanks';

class BookStore {
  // the link of the book to read
  @observable link: string = '';
  // an observable promise for the book associated with bookid
  @computed get promise() {
     return fromPromise(fetchBook(this.link)) as IPromiseBasedObservable<Book>;
  }
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
  // choice page state
  @observable step: Steps = 'what';
  @action.bound setStep(s: Steps) {
    this.step = s;
    this.selected = -1;
  }
  @observable selected: number = -1;
  @action.bound selectNext(n: number) {
    this.selected = (this.selected + 1) % n;
  }

  // link to parent
  store: Store;
  constructor(store: Store) {
    this.store = store;
  }
}

function parseQueryString(query: string) {
  return JSON.parse('{"' +
    decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
    '"}');
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
  @action.bound setQuery(
    search: string,
    category: string,
    reviewed: string,
    audience: string,
    language: string,
    page: number) {
    this.query.search = search;
    this.query.category = category;
    this.query.reviewed = reviewed;
    this.query.audience = audience;
    this.query.language = language;
    this.query.page = +page;
  }
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
  @computed get promise() {
     return fromPromise(fetchFind(this.queryString)) as IPromiseBasedObservable<FindResult>;
  }
  // get the find result without having to say promise.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get find() { return this.promise.value; }
  // set the find view
  @action.bound setView(v: FindView) {
    const search = v.query ? v.query.substring(1) : '';
    if (search.length > 0) {
      const o = parseQueryString(search);
      for (var p in o) {
        if (this.query.hasOwnProperty(p)) { this.query[p] = o[p];
        }
      }
    }
    console.log('set view', this.queryString);
  }

  // link to parent
  store: Store;

  // handle updating the find result
  constructor(store: Store) {
    this.store = store;
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
  @computed get promise() {
    return fromPromise(fetchChoose(this.list)) as IPromiseBasedObservable<FindResult>;
  }
  @computed get choose() { return this.promise.value; }
  @computed get nchoices() { return this.choose.books.length; }

  @action.bound setView(v: ChooseView) {
    const qs = v.query ? v.query.substring(1) : '';
    console.log('qs', qs);
    if (qs.length > 1) {
      const queries = parseQueryString(qs);
      console.log('qu', queries);
      this.list = queries.favorites.split(',');
      this.visible = 0;
      this.selected = -1;
    }
  }

  store: Store;
  constructor(store: Store) {
    this.store = store;
  }
}

class Store {
  public bs: BookStore;
  public fs: FindStore;
  public cs: ChooseStore;
  
  // update the state typically from a URL
  @observable currentView: ViewName = 'home';
  @action.bound setCurrentView(v: View) {
    console.log('setCurrentView', v);
    switch (v.view) {
      case 'home':
        this.currentView = 'home';
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
      case 'settings':
        this.toggleControlsVisible();
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
      return `/choose/?favorites=${this.cs.list.join(',')}`;
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
  readonly persistVersion = 3;
  // json string to persist the state
  @computed get persist(): string {
    const json = JSON.stringify({
      version: this.persistVersion,
      pictureTextMode: this.bs.pictureTextMode,
      fontScale: this.fontScale,
      pageTurnSize: this.pageTurnSize,
      query: this.fs.query,
      choices: this.cs.list
    });
    console.log('set persist', json);
    return json;
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
      this.cs.list = v.choices;
    }
  }

  constructor() {
    this.fs = new FindStore(this);
    this.cs = new ChooseStore(this);
    this.bs = new BookStore(this);
  }
}

export default Store;
