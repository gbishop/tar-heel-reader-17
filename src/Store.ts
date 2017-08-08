import { observable, computed, action, ObservableMap, autorun, createTransformer } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Book, fetchBook } from './Book';
import { FindResult, fetchFind, fetchChoose } from './FindResult';
import { NavButtonStyle, navButtonStyles } from './Styles';
import { Messages, fetchMessages } from './Messages';

export const enum Views {
  home = 'home',
  read = 'read',
  find = 'find',
  choose = 'choose',
  yourbooks = 'your-books',
  error = 'error',
}
    
interface HomeView {
  view: Views.home;
}

export interface BookView {
  view: Views.read;
  link: string;
  page: number;
}

interface FindView {
  view: Views.find;
  query?: {};
}

interface ChooseView {
  view: Views.choose;
  query?: { favorites?: string, name?: string };
}

interface YourBooksView {
  view: Views.yourbooks;
}

interface ErrorView {
  view: Views.error;
}

export type View = HomeView | BookView | FindView | ChooseView | YourBooksView | ErrorView;

export const enum Questions {
  what = 'what',
  rate = 'rate',
  thanks = 'thanks'
}

export function promiseValue<T>(p: IPromiseBasedObservable<T>): T {
  if (p.state === 'fulfilled') {
    return p.value;
  } else {
    throw new Error('unresolved promise');
  }
}

// parse query string from: https://stackoverflow.com/a/8649003/1115662
function parseQueryString(search: string) {
  search = search.substring(1);
  if (search) {
    return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
                      (key, value) => key === '' ? value : decodeURIComponent(value) );
  } else {
    return {};
  }
}

class BookStore {
  // the link of the book to read
  @observable link: string = '';
  // an observable promise for the book associated with bookid
  @computed get promise() {
     return fromPromise(fetchBook(this.link)) as IPromiseBasedObservable<Book>;
  }
  // get the book without having to say book.promise.value all the time
  // these computed are cached so this function only runs once after a change
  @computed get book() { return promiseValue(this.promise); }
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
  @observable question: Questions = Questions.what;
  @action.bound setQuestion(s: Questions) {
    this.question = s;
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
  @computed get find() { return promiseValue(this.promise); }
  // set the find view
  @action.bound setView(v: FindView) {
    const query = v.query || {};
    for (var p in query) {
      if (this.query.hasOwnProperty(p)) {
        this.query[p] = query[p];
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
  @observable lists: ObservableMap<string[]> = observable.map({Favorites: []});
  @observable currentListName: string = 'Favorites';
  @computed get list() { return this.lists.get(this.currentListName) || []; }
  // index of the currently selected book
  @observable selected: number = -1;
  @action.bound setSelected(i: number) {
    this.selected = i % this.list.length;
    if (this.selected < 0) {
      this.selected += this.list.length;
    }
  }
  @action.bound addFavorite(name: string, id: string) {
    const ids = this.lists.get(name) || [];
    if (ids.indexOf(id) === -1) {
      this.lists.set(name, [...ids, id]);
    }
  }
  @action.bound removeFavorite(name: string, id: string) {
    const ids = this.lists.get(name) || [];
    const index = ids.indexOf(id);
    if (index >= 0) {
      ids.splice(index, 1);
    }
  }
  isFavorite(name: string, id: string) {
    const ids = this.lists.get(name) || [];
    return ids.indexOf(id) !== -1;
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
  @computed get choose() { return promiseValue(this.promise); }
  @computed get nchoices() { return this.choose.books.length; }

  @action.bound setView(v: ChooseView) {
    if (v.hasOwnProperty('query') && v.query) {
      const name = v.query.name || 'Favorites';
      const favorites = v.query.favorites || '';
      this.currentListName = name;
      if (favorites.match(/[\d,]+$/)) {
        this.lists.set(this.currentListName, favorites.split(','));
      }
      this.visible = 0;
      this.selected = -1;
    }
  }

  @computed get path() {
    return `/choose/?favorites=${this.list.join(',')}&name=${this.currentListName}`;
  }

  store: Store;
  constructor(store: Store) {
    this.store = store;
  }
}

class MessagesStore {
  @observable locale = 'en';
  @computed get promise() {
    return fromPromise(fetchMessages(this.locale)) as IPromiseBasedObservable<Messages>;
  }
  @computed get M() {
    if (this.promise.state === 'fulfilled') {
      return this.promise.value;
    } else {
      throw new Error('Incorrect access to M');
    }
  }
  @action.bound setLocale(loc: string) {
    this.locale = loc;
  }

  store: Store;
  constructor(store: Store) {
    this.store = store;
  }
}

export class Store {
  public bs: BookStore;
  public fs: FindStore;
  public cs: ChooseStore;
  public ms: MessagesStore;
  
  // update the state typically from a URL
  @observable currentView: Views = Views.home;
  @action.bound setCurrentView(v: View) {
    console.log('setCurrentView', v);
    switch (v.view) {
      case Views.read:
        if (this.currentView === Views.choose) {
          this.preBookView = Views.choose;
        } else {
          this.preBookView = Views.find;
        }
        this.currentView = Views.read;
        this.bs.setView(v);
        break;
      case Views.find:
        this.currentView = Views.find;
        this.fs.setView(v);
        break;
      case Views.choose:
        this.currentView = Views.choose;
        this.cs.setView(v);
        break;
      case Views.yourbooks:
      case Views.error:
      case Views.home:
        this.currentView = v.view;
        break;
    }
  }
  // set either Find or Choose view depending on where you were last
  // on going back to Choose bump the index
  @observable preBookView: Views.find | Views.choose = Views.find;
  @action.bound setPreBookView() {
    if (this.preBookView === Views.find) {
      this.setCurrentView({
        view: Views.find
      });
    } else if (this.preBookView === Views.choose) {
      this.currentView = Views.choose;
    }
  }

  // map the state to a url
  @computed get currentPath() {
    if (this.currentView === Views.read) {
      return `${this.bs.link}` + (this.bs.pageno > 1 ? `${this.bs.pageno}` : '');
    } else if (this.currentView === Views.find) {
      return '/find/?' + this.fs.queryString;
    } else if (this.currentView === Views.choose) {
      return this.cs.path;
    } else if (this.currentView === Views.yourbooks) {
      return '/your-books/';
    } else {
      return '/';
    }
  }
  // map the url to the state
  routes = [
    { view: Views.yourbooks,
      pattern: /^\/your-books\// },
    { view: Views.choose,
      pattern: /^\/choose\// },
    { view: Views.read,
      pattern: /^(\/\d+\/\d+\/\d+\/[^/]+\/)(\d+)?$/ },
    { view: Views.home,
      pattern: /^\/$/ },
    { view: Views.find,
      pattern: /^\/find\// },
  ];
  // history listener matches path to routes above
  @action.bound doRoute(pathname: string, search: string) {
    console.log('doRoute', pathname, search);
    const qs = parseQueryString(search);
    for (var i = 0; i < this.routes.length; i++) {
      const match = pathname.match(this.routes[i].pattern);
      if (match) {
        console.log('got match', match);
        match.shift();
        this.setRoute(this.routes[i].view, match, qs);
        return;
      }
    }
    this.setCurrentView({view: Views.home});
  }
  // initialize the state from the pattern match and query string
  @action.bound setRoute(view: Views, match: string[], query: {}) {
    switch (view) {
      case Views.read:
        this.preBookView = Views.find;
        const link = match[0];
        const page = match[1] ? +match[1] : 1;
        this.bs.setView({
          view: Views.read,
          link: link,
          page: page
        });
        break;
      case Views.choose:
        this.cs.setView({
          view: Views.choose,
          query: query
        });
        break;
    }
    this.currentView = view;
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

  // colors
  @observable textColor: string = '#000';
  @action.bound setTextColor(v: string) {
    this.textColor = v;
    console.log('textColor', this.textColor);
  }
  @observable pageColor: string = '#fff';
  @action.bound setPageColor(v: string) {
    this.pageColor = v;
    console.log('pageColor', this.pageColor);
  }

  // speech
  @observable speak: boolean = false;
  @action.bound toggleSpeak() {
    this.speak = !this.speak;
  }
  @observable availableVoices = speechSynthesis.getVoices();
  @action.bound updateAvailableVoices() {
    console.log('updateAvailableVoices', this.availableVoices.length);
    this.availableVoices = speechSynthesis.getVoices();
    console.log('updateAvailableVoices', this.availableVoices);
  }
  @observable preferredVoice: ObservableMap<string> = observable.map();
  @action.bound setPreferredVoice(lang: string, uri: string) {
    if (uri) {
      this.preferredVoice.set(lang, uri);
    }
  }
  getVoice = createTransformer((lang: string) => {
    var best: SpeechSynthesisVoice | null = null;
    var def: SpeechSynthesisVoice | null = null;
    const uri = this.preferredVoice.get(lang);
    console.log('uri', uri, lang, this.availableVoices.length);
    for (var i = 0; i < this.availableVoices.length; i++) {
      const v = this.availableVoices[i];
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
  });

  @observable speechRate = 1; // 0.1 to 10
  @action.bound setSpeechRate(v: number) {
    this.speechRate = v;
  }
  @observable speechPitch = 1; // 0 to 2
  @action.bound setSpeechPitch(v: number) {
    this.speechPitch = v;
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
  readonly persistVersion = 7;
  // json string to persist the state
  @computed get persist(): string {
    const json = JSON.stringify({
      version: this.persistVersion,
      pictureTextMode: this.bs.pictureTextMode,
      fontScale: this.fontScale,
      pageTurnSize: this.pageTurnSize,
      query: this.fs.query,
      lists: this.cs.lists.toJS(),
      speak: this.speak,
      voice: this.preferredVoice.toJS(),
      rate: this.speechRate,
      pitch: this.speechPitch,
      locale: this.ms.locale,
      pageColor: this.pageColor,
      textColor: this.textColor
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
      for (var l in v.lists) {
        if (v.lists.hasOwnProperty(l)) {
          this.cs.lists.set(l, v.lists[l]);
        }
      }
      this.speak = v.speak;
      for (var k in v.voice) {
        if (v.voice.hasOwnProperty(k)) {
          this.preferredVoice.set(k, v.voice[k]);
        }
      }
      this.speechRate = v.rate;
      this.speechPitch = v.pitch;
      this.ms.locale = v.locale;
      this.textColor = v.textColor;
      this.pageColor = v.pageColor;
    }
  }

  constructor() {
    this.fs = new FindStore(this);
    this.cs = new ChooseStore(this);
    this.bs = new BookStore(this);
    this.ms = new MessagesStore(this);
    autorun(() => console.log('pf', this.preferredVoice.keys()));
    // enable tracking the voices available
    speechSynthesis.onvoiceschanged = this.updateAvailableVoices;
  }
}

export default Store;
