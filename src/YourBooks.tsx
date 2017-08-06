import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, ObservableMap, createTransformer, action, computed, transaction, autorun } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { FindResult, fetchChoose } from './FindResult';
import loading from './Loading';
import { Store, promiseValue, Views } from './Store';
import Menu from './Menu';
import { Icons, Icon } from './Icons';
import { Creatable } from 'react-select';

import 'react-select/dist/react-select.css';

import './YourBooks.css';

class FavList {
  @observable open: boolean;
  @observable promise: IPromiseBasedObservable<FindResult> | null;

  constructor(open: boolean = false) {
    console.log('create FavStatus');
    this.open = open;
    this.promise = null;
  }
}

interface YourBooksProps {
  store: Store;
}

interface FavoriteProps {
  store: Store;
  name: string;
}

interface Option {
    label: string;
    value: string;
}

@observer
class Favorite extends React.Component<FavoriteProps, {}> {
  @observable open = false;
  @action.bound toggleOpen() {
    this.open = !this.open;
  }
  @computed  get promise() {
    return fromPromise(fetchChoose(this.ids)) as IPromiseBasedObservable<FindResult>;
  }
  @observable selected: ObservableMap<boolean> = observable.map();
  isSelected = (id: string) => this.selected.has(id) && this.selected.get(id);
  @action.bound toggleSelected(id: string) {
    this.selected.set(id, !this.isSelected(id));
  }
  @computed get ids() { return this.props.store.cs.lists.get(this.props.name) || []; }

  @computed get allSelected() {
    const ids = this.props.store.cs.lists.get(this.props.name) || [];
    return ids.filter(id => this.selected.get(id) || false);
  }
  @computed get numberSelected() {
    return this.allSelected.length;
  }
  @action.bound cleanupLists() {
    const store = this.props.store;
    const lists = store.cs.lists.keys();
    lists.forEach(name => {
      if (name !== 'Favorites') {
        const ids = store.cs.lists.get(name);
        if (!ids || ids.length === 0) {
          store.cs.lists.delete(name);
        }
      }
    });
  }
  @action.bound dropBooks() {
    this.allSelected.forEach(id => this.props.store.cs.removeFavorite(this.props.name, id));
    this.cleanupLists();
  }
  @observable copyName: string = '';
  @action.bound setCopyName(o: Option) {
    this.copyName = o.value;
  }
  @action.bound copyBooks(name: string) {
    this.allSelected.forEach(id => this.props.store.cs.addFavorite(name, id));
    this.showCopySelect = false;
  }
  @observable showCopySelect = false;
  @action.bound toggleShowCopySelect() {
    this.showCopySelect = !this.showCopySelect;
  }
  render() {
    const { store, name } = this.props;
    var body = null;
    if (this.open) {
      var bookList = [];
      if (this.promise.state === 'fulfilled') {
        const books = promiseValue(this.promise).books;
        for (var i = 0; i < this.ids.length; i++) {
          const id = this.ids[i];
          const book = books.find((b) => '' + b.ID === id);
          if (book) {
            bookList.push(
              <li key={book.ID}>
                <input
                  type="checkbox"
                  checked={this.isSelected(id)}
                  onChange={() => this.toggleSelected(id)}
                />
                {book.title}
              </li>);
          }
        }
      }
      const options: Option[] = store.cs.lists.keys().filter(k => k !== this.props.name)
        .map(k => { return {value: k, label: k};});
      body = (
        <div>
          <button
            disabled={this.numberSelected === 0}
            onClick={() => this.dropBooks()}
          >
            Drop
          </button>
          <button
            disabled={this.numberSelected === 0}
            onClick={this.toggleShowCopySelect}
          >
            Copy
          </button>
          { this.showCopySelect && 
            <Creatable
              options={options}
              onChange={(e: Option) => e && this.copyBooks(e.value)}
              openOnFocus={true}
              autofocus={true}
              promptTextCreator={(s) => `Create list "${s}"`}
              placeholder="Select a list"
              clearable={false}
            />
          }
          <ul>{bookList}</ul>
        </div>
      );
    }

    return (
      <div className="YourBooks-Book">
        <button
          className="YourBooks-Edit"
          onClick={this.toggleOpen}
        >
          <Icon icon={Icons.pencil} size={16} color="black" />
        </button>
        <button
          className="YourBooks-Name"
          onClick={e => store.setCurrentView({ view: Views.choose, query: {name: name}})}
        >
          {name} ({this.ids.length})
        </button>
        {body}
      </div>);
  }
}

@observer
class YourBooks extends React.Component<YourBooksProps, {}> {
  render() {
    const store = this.props.store;
    const favs = store.cs.lists.keys().sort().map(name => (
      <Favorite key={name} store={store} name={name} />));
    return (
      <div className="YourBooks">
        <Menu store={store} />
        <h1>Your Favorites</h1>
        {favs}
      </div>
    );
  }
}

export default YourBooks;
