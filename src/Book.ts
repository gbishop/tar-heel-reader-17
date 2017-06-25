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
  author: String,
  pages: Array(Page),
  link: String
});

// construct the typescript type
export type Book = Static<typeof BookValidator>;

export function fetchBook(slug: string): Promise<Book> {
  return new Promise((resolve, reject) => {
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
  });
}

export default Book;
