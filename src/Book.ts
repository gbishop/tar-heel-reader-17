import { Number, String, Array, Record, Static } from 'runtypes';

// construct the validator for shared books
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
});

// construct the typescript type
export type Book = Static<typeof BookValidator>;

export function fetchBook(url: string): Promise<Book> {
  return new Promise((resolve, reject) => {
    console.log('url', url);
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
