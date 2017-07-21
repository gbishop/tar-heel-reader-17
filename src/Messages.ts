const enMessages = {
  home: 'Home page',
  find: 'Find books',
  choose: 'Choose a book',
  settings: 'Settings',
  next: 'Next',
  back: 'Back',
  SearchFor: 'Search for',
  EnterTextToSearch: 'Enter text to search',
  Topics: 'Topics',
  AllTopics: 'All Topics',
  Alph: 'Alphabet',
  Anim: 'Animals and Nature',
  ArtM: 'Art and Music',
  Biog: 'Biographies',
  Fair: 'Fairy and Folk Tales',
  Fict: 'Fiction',
  Food: 'Foods',
  Heal: 'Health',
  Hist: 'History',
  Holi: 'Holidays',
  Math: 'Math and Science',
  Nurs: 'Nursery Rhymes',
  Peop: 'People and Places',
  Poet: 'Poetry',
  Recr: 'Recreation and Leisure',
  Spor: 'Sports',
  ReviewStatus: 'Review status',
  ReviewedOnly: 'Reviewed only',
  IncludeUnreviewed: 'Include unreviewed',
  Audience: 'Audience',
  RatedE: 'Rated E/Everybody',
  RatedC: 'Rated C/Caution',
  AnyRating: 'Any rating',
  Language: 'Language',
  Search: 'Search',
  ar: 'Arabic',
  eu: 'Basque',
  ca: 'Catalan',
  zh: 'Chinese',
  chr: 'Cherokee',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  fil: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  gl: 'Galician',
  de: 'German',
  el: 'Greek',
  he: 'Hebrew',
  is: 'Icelandic',
  id: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  la: 'Latin',
  no: 'Norwegian',
  pl: 'Polish',
  pt: 'Portuguese',
  sa: 'Sanskrit',
  es: 'Spanish',
  sv: 'Swedish',
  tr: 'Turkish',
  ButtonSize: 'Button Size',
  normal: 'Normal',
  medium: 'Medium',
  large: 'Large',
  off: 'None',
  silent: 'Silent',
  ReadingControls: 'Reading Controls',
  FontSize: 'Font Size',
  AlternatePictureAndText: 'Alternate Picture and Text',
  Voice: 'Voice',
  Close: 'Close',
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
