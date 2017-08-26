import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views } from './Store';
import Controls from './Controls';
import Menu from './Menu';
import loading from './Loading';
import { FindBook } from './FindResult';

const stars = {
  'Not yet rated': require('./icons/0stars.png'),
  '1 stars': require('./icons/1stars.png'),
  '1.5 stars': require('./icons/1.5stars.png'),
  '2 stars': require('./icons/2stars.png'),
  '2.5 stars': require('./icons/2.5stars.png'),
  '3 stars': require('./icons/3stars.png')
};

const reviewed = require('./icons/reviewed.png');
const caution = require('./icons/caution.png');

const FavoriteNoIcon = require('./icons/FavoriteNoIcon.png');
const FavoriteYesIcon = require('./icons/FavoriteYesIcon.png');

import './Find.css';
import './Loading.css';

class SearchForm extends React.Component<{store: Store}, {}> {
  form: HTMLFormElement | null;
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.form) {
      return;
    }
    console.log('submit', e, this.form, this.form.search.value, this.form.category.value);
    const store = this.props.store;
    store.fs.setQuery(this.form.search.value, this.form.category.value,
      this.form.reviewed.value, this.form.audience.value, this.form.language.value,
      +this.form.page.value);
  }
  render() {
    const store = this.props.store;
    const M = store.ms.M;
    return (
      <form id="myform" onSubmit={this.onSubmit} ref={(f) => this.form = f}>
        <Menu store={store} modifiers="inline"/>
        <label htmlFor="I-search" >{M.SearchFor}</label>
        <input
          type="search"
          defaultValue={store.fs.query.search}
          id="I-search"
          name="search"
          placeholder={M.EnterTextToSearch}
        />
        <label htmlFor="I-category" >{M.Topics}</label>
        <select
          id="I-category"
          name="category"
          defaultValue={store.fs.query.category}
        >
          <option value="" >{M.AllTopics}</option>
          <option value="Alph" >{M.Alph}</option>
          <option value="Anim" >{M.Anim}</option>
          <option value="ArtM" >{M.ArtM}</option>
          <option value="Biog" >{M.Biog}</option>
          <option value="Fair" >{M.Fair}</option>
          <option value="Fict" >{M.Fict}</option>
          <option value="Food" >{M.Food}</option>
          <option value="Heal" >{M.Heal}</option>
          <option value="Hist" >{M.Hist}</option>
          <option value="Holi" >{M.Holi}</option>
          <option value="Math" >{M.Math}</option>
          <option value="Nurs" >{M.Nurs}</option>
          <option value="Peop" >{M.Peop}</option>
          <option value="Poet" >{M.Poet}</option>
          <option value="Recr" >{M.Recr}</option>
          <option value="Spor" >{M.Spor}</option>
        </select>
        <label htmlFor="I-reviewed" >{M.ReviewStatus}</label>
        <select
          id="I-reviewed"
          name="reviewed"
          defaultValue={store.fs.query.reviewed}
        >
          <option value="R">{M.ReviewedOnly}</option>
          <option value="" >{M.IncludeUnreviewed}</option>
        </select>
        <label htmlFor="I-audience" >{M.Audience}</label>
        <select
          id="I-audience"
          name="audience"
          defaultValue={store.fs.query.audience}
        >
          <option value="E" >{M.RatedE}</option>
          <option value="C" >{M.RatedC}</option>
          <option value="" >{M.AnyRating}</option>
        </select>
        <label htmlFor="I-language" >{M.Language}</label>
        <select
          id="I-language"
          name="language"
          defaultValue={store.fs.query.language}
        >
          <option value="ar" >{M.ar}</option>
          <option value="eu" >{M.eu}</option>
          <option value="ca" >{M.ca}</option>
          <option value="zh" >{M.zh}</option>
          <option value="chr" >{M.chr}</option>
          <option value="da" >{M.da}</option>
          <option value="nl" >{M.nl}</option>
          <option value="en" >{M.en}</option>
          <option value="fil" >{M.fil}</option>
          <option value="fi" >{M.fi}</option>
          <option value="fr" >{M.fr}</option>
          <option value="gl" >{M.gl}</option>
          <option value="de" >{M.de}</option>
          <option value="el" >{M.el}</option>
          <option value="he" >{M.he}</option>
          <option value="is" >{M.is}</option>
          <option value="id" >{M.id}</option>
          <option value="it" >{M.it}</option>
          <option value="ja" >{M.ja}</option>
          <option value="la" >{M.la}</option>
          <option value="no" >{M.no}</option>
          <option value="pl" >{M.pl}</option>
          <option value="pt" >{M.pt}</option>
          <option value="sa" >{M.sa}</option>
          <option value="es" >{M.es}</option>
          <option value="sv" >{M.sv}</option>
          <option value="tr" >{M.tr}</option>
        </select>
        <input type="hidden" value="1" id="I-page" name="page"  />
        <input type="submit" value={M.Search} id="I-"   />
      </form>
    );
  }
}

@observer
class Favorite extends React.Component<{store: Store, bid: number}, {}> {
  render() {
    const store = this.props.store;
    const bid = String(this.props.bid);
    const favs = store.cs.lists.get('Favorites') || [];
    const isFav = favs.indexOf(bid) >= 0;
    function toggleFavorite(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.checked) {
        store.cs.addFavorite('Favorites', e.target.name);
      } else {
        store.cs.removeFavorite('Favorites', e.target.name);
      }
    }
    const src = isFav ? FavoriteYesIcon : FavoriteNoIcon;
    return (
      <span className="Find-Favorite">
        <input
          type="checkbox"
          id={bid}
          name={bid}
          checked={isFav}
          onChange={toggleFavorite}
        />
        <label htmlFor={bid} ><img src={src} alt="Add to favorites" /></label>
        
      </span>
    );
  }
}

@observer
class FindResult extends React.Component<{store: Store, book: FindBook}, {}> {
  render() {
    const baseUrl = process.env.PUBLIC_URL;
    const b = this.props.book;
    const store = this.props.store;
    return (
      <li> 
        <button 
          className="Find-ReadButton"
          onClick={e => store.setCurrentView({
            view: Views.read,
            link: b.link, 
            page: 1})
          } 
        >
          <img src={baseUrl + b.cover.url} alt={b.title} />
        </button>
        <h1>{b.title}</h1>
        <p className="Find-Author">{b.author}</p>
        <img className="Find-Icon" src={stars[b.rating.text]} title={b.rating.text} />
        {b.reviewed && (<img src={reviewed} className="Find-Icon" alt="reviewed" />)}
        {b.caution && (<img src={caution} className="Find-Icon" alt="caution" />)}
        <Favorite store={store} bid={b.ID} />
        <p className="Find-Pages">{`${b.pages} pages.`}</p>
      </li>);
  }
}

@observer
class Find extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const waitmsg = loading(store.fs.promise);
    if (waitmsg) {
      return waitmsg;
    }
    const findResults = store.fs.find.books.map(b => (
      <FindResult key={b.ID} book={b} store={store} />
    ));
    return (
      <div
        className="Find"
      >
        <div className="Find-Form">
          <SearchForm store={store} />
        </div>
        <ul className="Find-Results" >
          {findResults}
        </ul>
        <Controls store={store} />
      </div>);
  }
}

export default Find;
