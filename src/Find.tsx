import * as React from 'react';
import { observable, computed, action, reaction } from 'mobx';
import { observer } from 'mobx-react';
import NRKeyHandler from './NRKeyHandler';
import Modal = require('react-modal');
import Store from './Store';
import ErrorMsg from './ErrorMsg';
import Controls from './Controls';

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

class SearchForm extends React.Component<{store: Store}, void> {
  form: HTMLFormElement;
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit', e, this.form, this.form.search.value, this.form.category.value);
    const store = this.props.store;
    store.findQuery.search = this.form.search.value;
    store.findQuery.category = this.form.category.value;
    store.findQuery.reviewed = this.form.reviewed.value;
    store.findQuery.language = this.form.language.value;
    store.findQuery.page = +this.form.page.value;
    store.startFind();
  }
  render() {
    const store = this.props.store;
    return (
      <form id="myform" onSubmit={this.onSubmit} ref={(f) => this.form = f}>
        <label htmlFor="I-search" >Search for</label>
        <input
          type="search"
          defaultValue={store.findQuery.search}
          id="I-search"
          name="search"
          placeholder="Enter text to search"
          title="Enter text to search"
        />
        <label htmlFor="I-category" >Topics</label>
        <select
          id="I-category"
          name="category"
          defaultValue={store.findQuery.category}
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
          defaultValue={store.findQuery.reviewed}
        >
          <option value="R">Reviewed only</option>
          <option value="" >Include unreviewed</option>
        </select>
        <label htmlFor="I-audience" >Audience</label>
        <select
          id="I-audience"
          name="audience"
          defaultValue={store.findQuery.audience}
        >
          <option value="E" >Rated E/Everybody</option>
          <option value="C" >Rated C/Caution</option>
          <option value="" >Any rating</option>
        </select>
        <label htmlFor="I-language" >Language</label>
        <select
          id="I-language"
          name="language"
          defaultValue={store.findQuery.language}
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
  if (!store.findP || store.findP.state === 'pending') {
    return <h1>Find loading</h1>;
  } else if (store.findP.state === 'rejected') {
    return <ErrorMsg error={store.findP.reason} />;
  } else {
    const findResults = store.find.books.map(b => (
      <li key={b.ID}>
        <button onClick={e => store.setBookView(b.link, 1)} >
          <img className="cover" src={store.fontScale <= 2 ? b.cover.url : b.preview.url} />
          <h1>{b.title}</h1>
          <p className="author">{b.author}</p>
          <img className="stars" src={stars[b.rating.text]} title={b.rating.text} />
          {b.reviewed && (<img src={reviewed} className="reviewed" />)}
          {b.caution && (<img src={caution} className="caution" />)}
          <p className="pages">{b.pages} pages</p>
        </button>
      </li>));
    return (
      <div
        id="Find"
        style={{fontSize: store.textFontSize / 1.8}}
      >
        <div id="Find-form">
          <SearchForm store={store} />
        </div>
        <ul id="Find-results">
          {findResults}
          <li style={{clear: 'both'}} />
        </ul>
        <Controls store={store} />
        <NRKeyHandler
          keyValue={'ArrowRight'}
          onKeyHandle={(e) => store.findQuery.page++}
        />
      </div>);
  }
});

export default Find;
