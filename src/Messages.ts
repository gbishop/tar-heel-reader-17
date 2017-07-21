const enMessages = {
  home: 'Home page',
  find: 'Find books',
  choose: 'Choose a book',
  settings: 'Settings'
};

export type Messages = typeof enMessages;

export function fetchMessages(locale: string): Promise<Messages> {
  return new Promise((resolve, reject) => {
    if (locale === 'en') {
      resolve(enMessages);
    } else {
      const url = process.env.PUBLIC_URL + `/lang/${locale}.json`;
      window.fetch(url)
        .then(res => {
          if (res.ok) {
            res.json().then(resolve).catch(reject);
          } else {
            reject(res);
          }
        })
        .catch(reject);
    }
  });
}

export default Messages;
