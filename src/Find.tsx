import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Controls from './Controls';
import Menu from './Menu';
import loading from './Loading';

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
    return (
      <form id="myform" onSubmit={this.onSubmit} ref={(f) => this.form = f}>
        <Menu store={store} modifiers="inline"/>
        <label htmlFor="I-search" >Search for</label>
        <input
          type="search"
          defaultValue={store.fs.query.search}
          id="I-search"
          name="search"
          placeholder="Enter text to search"
          title="Enter text to search"
        />
        <label htmlFor="I-category" >Topics</label>
        <select
          id="I-category"
          name="category"
          defaultValue={store.fs.query.category}
        >
          <option value="" >All Topics</option>
          <option value="Alph" >Alphabet</option>
          <option value="Anim" >Animals and Nature</option>
          <option value="ArtM" >Art and Music</option>
          <option value="Biog" >Biographies</option>
          <option value="Fair" >Fairy and Folk Tales</option>
          <option value="Fict" >Fiction</option>
          <option value="Food" >Foods</option>
          <option value="Heal" >Health</option>
          <option value="Hist" >History</option>
          <option value="Holi" >Holidays</option>
          <option value="Math" >Math and Science</option>
          <option value="Nurs" >Nursery Rhymes</option>
          <option value="Peop" >People and Places</option>
          <option value="Poet" >Poetry</option>
          <option value="Recr" >Recreation and Leisure</option>
          <option value="Spor" >Sports</option>
        </select>
        <label htmlFor="I-reviewed" >Review status</label>
        <select
          id="I-reviewed"
          name="reviewed"
          defaultValue={store.fs.query.reviewed}
        >
          <option value="R">Reviewed only</option>
          <option value="" >Include unreviewed</option>
        </select>
        <label htmlFor="I-audience" >Audience</label>
        <select
          id="I-audience"
          name="audience"
          defaultValue={store.fs.query.audience}
        >
          <option value="E" >Rated E/Everybody</option>
          <option value="C" >Rated C/Caution</option>
          <option value="" >Any rating</option>
        </select>
        <label htmlFor="I-language" >Language</label>
        <select
          id="I-language"
          name="language"
          defaultValue={store.fs.query.language}
        >
          <option value="ar" >Arabic</option>
          <option value="eu" >Basque</option>
          <option value="ca" >Catalan</option>
          <option value="zh" >Chinese</option>
          <option value="chr" >Cherokee</option>
          <option value="da" >Danish</option>
          <option value="nl" >Dutch</option>
          <option value="en" >English</option>
          <option value="fil" >Filipino</option>
          <option value="fi" >Finnish</option>
          <option value="fr" >French</option>
          <option value="gl" >Galician</option>
          <option value="de" >German</option>
          <option value="el" >Greek</option>
          <option value="he" >Hebrew</option>
          <option value="is" >Icelandic</option>
          <option value="id" >Indonesian</option>
          <option value="it" >Italian</option>
          <option value="ja" >Japanese</option>
          <option value="la" >Latin</option>
          <option value="no" >Norwegian</option>
          <option value="pl" >Polish</option>
          <option value="pt" >Portuguese</option>
          <option value="sa" >Sanskrit</option>
          <option value="es" >Spanish</option>
          <option value="sv" >Swedish</option>
          <option value="tr" >Turkish</option>
        </select>
        <input type="hidden" value="1" id="I-page" name="page"  />
        <input type="submit" value="Search" id="I-"   />
      </form>
    );
  }
}

const Find = observer(function Find(props: {store: Store}) {
  const store = props.store;
  const waitmsg = loading(store.fs.promise);
  if (waitmsg) {
    return waitmsg;
  }
  const baseUrl = process.env.PUBLIC_URL;
  const findResults = store.fs.find.books.map(b => (
    <li key={b.ID}>
      <button 
        className="Find-ReadButton"
        onClick={e => store.setCurrentView({
          view: 'book',
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
      <p className="Find-Pages">{`${b.pages} pages.`}</p>
      <div style={{clear: 'both'}} />
    </li>));
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
});

export default Find;
