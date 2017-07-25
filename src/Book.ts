import { Number, String, Array, Record, Static } from 'runtypes';

// construct the validator for books
const Page = Record({
  text: String,
  url: String,
  width: Number,
  height: Number
});

const BookValidator = Record({
  title: String,
  slug: String,
  ID: Number,
  author: String,
  pages: Array(Page),
  link: String,
  language: String,
  rating_count: Number,
  rating_total: Number,
  rating_value: Number
});

// construct the typescript type
export type Book = Static<typeof BookValidator>;

export function fetchBook(link: string): Promise<Book> {
  return new Promise((resolve, reject) => {
    const slugMatch = /(?:\/\d+){3}\/([^/]+)\//.exec(link);
    if (slugMatch) {
      const slug = slugMatch[1];
      const url = `/THR/api/book-as-json/?slug=${slug}`;
      window.fetch(url)
        .then(res => {
          if (res.ok) {
            res.json().then(obj => resolve(BookValidator.check(obj))).catch(reject);
          } else {
            reject(res);
          }
        })
        .catch(reject);
    }
  });
}

export default Book;
