import { Number, Boolean, String, Array, Record, Static } from 'runtypes';

// construct the validator for find results
const FindBookValidator = Record({
  title: String,
  slug: String,
  author: String,
  link: String,
  ID: Number,
  cover: Record({
    url: String,
  }),
  preview: Record({
    url: String,
  }),
  pages: Number,
  rating: Record({
    icon: String,
    img: String,
    text: String
  }),
  reviewed: Boolean,
  caution: Boolean,
  language: String
});

const FindValidator = Record({
  books: Array(FindBookValidator),
});

// construct the typescript type
export type FindResult = Static<typeof FindValidator>;
export type FindBook = Static<typeof FindBookValidator>;

export function fetchFind(query: string): Promise<FindResult> {
  return new Promise((resolve, reject) => {
    const url = `/THR/api/find/?${query}&json=1`;
    window.fetch(url)
      .then(res => {
        if (res.ok) {
          res.json().then(obj => resolve(FindValidator.check(obj))).catch(reject);
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
}

export function fetchChoose(ids: string[]): Promise<FindResult> {
  return new Promise((resolve, reject) => {
    const sids = ids.join(',');
    const url = `/THR/api/favorites/?favorites=${sids}&json=1`;
    window.fetch(url)
      .then(res => {
        if (res.ok) {
          res.json().then(obj => resolve(FindValidator.check(obj))).catch(reject);
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
}

export default FindResult;
