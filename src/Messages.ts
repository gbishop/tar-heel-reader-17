// tslint:disable:max-line-length
const enMessages = {
  home: 'Home page',
  welcome: 'Welcome',
  welcomeTo: 'Welcome to the Tar Heel Reader, a collection of free, easy-to-read, and accessible books on a wide range of topics. Each book can be speech enabled and accessed using multiple interfaces, including touch screens, the IntelliKeys with custom overlays, and 1 to 3 switches.',
  explanation: 'This is a rough prototype for the new version of Tar Heel Reader. You are free to use it with the understanding that it might change or break as we work on it. It supports big fonts, improved eye gaze access, and better speech in a design that takes advantage of the capabilities of modern web browsers.',
  usageChanges: 'The usage model has changed significantly.',
  rationale: 'We invite you to read and comment on our rationale for the new design.',
  survey: 'Please take our design survey.',
  otherLangs: 'This site is also available in other languages. To help with translation, contact us.',
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
  Default: 'Default',
  SpeakText: 'Speak Text',
  SpeechRate: 'Speech Rate',
  SpeechPitch: 'Speech Pitch',
  WhatNow: 'What would you like to do now?',
  ReadAgain: 'Read this book again.',
  Rate: 'Rate this book.',
  Another: 'Choose another book.',
  HowRate: 'How do you rate this book?',
  Rate1: '1 star',
  Rate2: '2 stars',
  Rate3: '3 stars',
  loginMessage: 'Log in to Tar Heel Reader',
  username: 'Username',
  password: 'Password',
  remember: 'Remember Me',
  login: 'Log In',
  logout: 'Log Out',
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
