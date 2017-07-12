import { observable, computed, action, reaction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';
import { FindResult, fetchFind, fetchChoose } from './FindResult';
import { NavButtonStyle, navButtonStyles } from './Styles';

type PageTurnSize = 'normal' | 'medium' | 'large' | 'off';

type ViewName = 'landing' | 'book' | 'find' | 'choose' | 'error';

interface LandingView {
  view: 'landing';
}

interface BookView {
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

type View = LandingView | BookView | FindView | ChooseView | ErrorView;

class Store {
  // the link of the book to read or '' for the landing page
  @observable booklink: string = '';
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
  @observable currentView: ViewName = 'landing';
  @action.bound setCurrentView(v: View) {
    switch (v.view) {
      case 'landing':
        this.currentView = 'landing';
        break;
      case 'book':
        if (this.currentView === 'choose') {
          this.preBookView = 'choose';
        } else {
          this.preBookView = 'find';
        }
        this.currentView = 'book';
        this.booklink = v.link;
        this.pageno = v.page;
        this.pictureTextToggle = 'picture';
        break;
      case 'find':
        this.currentView = 'find';
        const search = v.query.substring(1);
        this.findQueryWatch = true;
        if (search.length > 0) {
          const o = JSON.parse('{"' +
            decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
            '"}');
          for (var p in o) {
            if (this.findQuery.hasOwnProperty(p)) {
              this.findQuery[p] = o[p];
            }
          }
        }
        break;
      case 'choose':
        this.currentView = 'choose';
        this.chooseList = v.ids.split(',');
        this.chooseIndex = 0;
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
      this.nextChooseIndex();
    }
  }

  // map the state to a url
  @computed get currentPath() {
    if (this.currentView === 'book') {
      return `${this.booklink}` + (this.pageno > 1 ? `${this.pageno}` : '');
    } else if (this.currentView === 'find') {
      return '/find/?' + this.findQueryString;
    } else if (this.currentView === 'choose') {
      return `/choose/${this.chooseList.join(',')}`;
    } else {
      return '/';
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

  // visibility of the controls modal
  @observable controlsVisible: boolean = false;
  @action.bound toggleControlsVisible() {
    this.controlsVisible = !this.controlsVisible;
  }

  // Find related variables
  @observable findQuery = {
    search: '',
    category: '',
    reviewed: 'R',
    audience: 'E',
    language: 'en',
    page: 1,
    count: 24
  };
  @computed get findQueryString() {
    let parts = [];
    const q = this.findQuery;
    for (var p in q) {
      if (q.hasOwnProperty(p)) {
        parts.push(encodeURIComponent(p) + '=' + encodeURIComponent(this.findQuery[p]));
      }
    }
    return parts.join('&');
  }
  // an observable promise for the find result associated with the findQuery
  @observable findP: IPromiseBasedObservable<FindResult>;
  // get the find result without having to say findP.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get find() { return this.findP.value; }
  // format of find page books
  @observable findFormat: 'boxes' | 'single' = 'boxes';
  @action.bound setFindFormat(format: string) {
    if (format === 'boxes' || format === 'single') {
      this.findFormat = format;
    }
  }

  @observable chooseList: string[] = [];
  @observable chooseIndex: number = 0;

  // an observable promise for the choose result
  @observable chooseP: IPromiseBasedObservable<FindResult>;
  @computed get choose() { return this.chooseP.value; }

  @action.bound nextChooseIndex() {
    this.chooseIndex = (this.chooseIndex + 1) % this.choose.books.length;
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
      pictureTextMode: this.pictureTextMode,
      fontScale: this.fontScale,
      pageTurnSize: this.pageTurnSize,
      query: this.findQuery
    });
  }
  // restore the state from json
  @action.bound setPersist(js: string) {
    var v = JSON.parse(js);
    if (v.version === this.persistVersion) {
      this.pictureTextMode = v.pictureTextMode;
      this.fontScale = v.fontScale;
      this.pageTurnSize = v.pageTurnSize;
      this.findQuery.search = v.query.search;
      this.findQuery.category = v.query.category;
      this.findQuery.reviewed = v.query.reviewed;
      this.findQuery.audience = v.query.audience;
      this.findQuery.language = v.query.language;
      this.findQuery.page = v.query.page;
    }
  }
  // handle updating the book when the id changes
  fetchHandler: {};
  // handle updating the find result
  findHandler: {};
  @observable findQueryWatch = false;
  // handle updating choose result
  chooseHandler: {};

  constructor() {
    // fetch the book when the id changes
    // figure out when to dispose of this
    this.fetchHandler = reaction(
      () => this.booklink,
      (booklink) => {
        this.bookP = fromPromise(fetchBook(this.booklink)) as IPromiseBasedObservable<Book>;
      });
    this.findHandler = reaction(
      () => [ this.findQueryString, this.findQueryWatch ],
      ([query, watch]) => {
        this.findP = fromPromise(fetchFind(this.findQueryString)) as
          IPromiseBasedObservable<FindResult>;
      });
    this.chooseHandler = reaction(
      () => this.chooseList,
      (list) => {
        this.chooseP = fromPromise(fetchChoose(this.chooseList)) as
          IPromiseBasedObservable<FindResult>;
      });
  }
}

export default Store;
