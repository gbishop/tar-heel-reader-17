import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, ObservableMap, createTransformer, action, computed, transaction, autorun } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { FindResult, fetchChoose } from './FindResult';
import loading from './Loading';
import Store from './Store';
import Menu from './Menu';

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

@observer
class Favorite extends React.Component<FavoriteProps, {}> {
  @observable open = false;
  @action.bound toggleOpen() {
    this.open = !this.open;
  }
  @computed  get promise() {
    const ids = this.props.store.cs.lists.get(this.props.name)!;
    return fromPromise(fetchChoose(ids)) as IPromiseBasedObservable<FindResult>
  }
  @observable selected: ObservableMap<boolean> = observable.map();
  isSelected = (id: string) => this.selected.has(id) && this.selected.get(id);
  @action.bound toggleSelected(id: string) {
    this.selected.set(id, !this.isSelected(id));
  }
  render() {
    const { store, name } = this.props;
    var body = null;
    if (this.open) {
      const ids = store.cs.lists.get(name) || [];
      if (this.promise.state === 'fulfilled') {
        body = ids.map((id) => {
          const book = this.promise.value;
        }
      }
    }

    return (
      <h2>
        <input
          type="checkbox"
          checked={this.open}
          onChange=(() => this.toggleOpen()}
        >
        {name}
      </h2>

}

@observer
class YourBooks extends React.Component<YourBooksProps, {}> {
  @observable status: ObservableMap<FavList> = observable.map();
  @observable selected: ObservableMap<boolean> = observable.map();
  @observable openCount = 0;

  isOpen(name: string) {
    const stat = this.status.get(name);
    return stat && stat.open || false;
  }
  @action.bound toggleOpen(name: string) {
    const stat = this.status.get(name) || new FavList();
    stat.open = !stat.open;
    this.status.set(name, stat);
    console.log('stat', stat);
  }
  key(name: string, id: string | number) {
    return name + '-' + id;
  }
  @observable isSelected(name: string, id: string | number) { 
    return this.selected.get(this.key(name, id)) && this.props.store.cs.isFavorite(name, '' + id);
  } 
  @action.bound toggleSelected(name: string, id: string | number) {
    const key = this.key(name, id);
    this.selected.set(key, !this.selected.get(key));
    console.log('toggle selected', key, this.selected.get(key));
  }
  @observable forEachSelected(f: (name: string, id: string) => void) {
    this.props.store.cs.lists.forEach((ids, name) => {
      ids.forEach((id) => {
        if (this.isSelected(name, id)) {
          f(name, id);
        }
      });
    });
  }
  @computed get selectedCount() {
    var count = 0;
    this.forEachSelected((name, id) => count += 1);
    console.log('selectedCount', count);
    return count;
  }
  constructor() {
    super();
    autorun(() => console.log('selected', this.selected.keys()));
  }

  render() {
    const store = this.props.store;
    const items = store.cs.lists.keys().map(name => {
      let fav = this.status.get(name);
      let list = null;
      console.log('fav', fav, name);
      if (fav && fav.open) {
        if (!fav.promise) {
          const ids = store.cs.lists.get(name) || [];
          console.log('fetch fav');
          fav.promise = ;
        }
        console.log('fav.promise.state', fav.promise.state);
        if (fav.promise.state === 'fulfilled') {
          const books = fav.promise.value.books.map(b => (
            <li key={b.ID}>
              <label>
                <input
                  type="checkbox"
                  checked={this.isSelected(name, '' + b.ID)}
                  onChange={(e) => this.toggleSelected(name, '' + b.ID)}
                />
                {b.title}
              </label>
            </li>));
          list = <ul>{books}</ul>;
        } else {
          list = loading(fav.promise);
        }
      }
      return (
        <div key={name}>
          <h2>
            <input
              type="checkbox"
              checked={this.isOpen(name)}
              onChange={() => this.toggleOpen(name)}
            />

            {name}
          </h2>
          {list}
        </div>);
    });
    console.log('items', items);
    return (
      <div className="YourFavorites">
        <Menu store={store} />
        <h1>Your Favorites</h1>
        <button
          disabled={this.selectedCount === 0}
          onClick={() => this.forEachSelected((name, id) => store.cs.removeFavorite(name, id))}
        >
          Drop
        </button>
        {items}
      </div>
    );
  }
}

export default YourBooks;
