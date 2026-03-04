export interface WordCard {
  dutch: string;
  translation: string;
  transcription: string;
  category: string;
}

export const starterWords: WordCard[] = [
  { dutch: 'huis', translation: 'будинок', transcription: '[hœys]', category: 'Побут' },
  { dutch: 'deur', translation: 'двері', transcription: '[døːr]', category: 'Побут' },
  { dutch: 'water', translation: 'вода', transcription: '[ˈʋaːtər]', category: 'Побут' },
  { dutch: 'brood', translation: 'хліб', transcription: '[broːt]', category: 'Їжа' },
  { dutch: 'melk', translation: 'молоко', transcription: '[mɛlk]', category: 'Їжа' },
  { dutch: 'appel', translation: 'яблуко', transcription: '[ˈɑpəl]', category: 'Їжа' },
  { dutch: 'fiets', translation: 'велосипед', transcription: '[fits]', category: 'Транспорт' },
  { dutch: 'trein', translation: 'поїзд', transcription: '[trɛin]', category: 'Транспорт' },
  { dutch: 'werk', translation: 'робота', transcription: '[ʋɛrk]', category: 'Робота' },
  { dutch: 'kantoor', translation: 'офіс', transcription: '[kɑnˈtoːr]', category: 'Робота' },
  { dutch: 'school', translation: 'школа', transcription: '[sxoːl]', category: 'Навчання' },
  { dutch: 'boek', translation: 'книга', transcription: '[buk]', category: 'Навчання' },
  { dutch: 'vriend', translation: 'друг', transcription: '[vrint]', category: 'Люди' },
  { dutch: 'familie', translation: 'сімʼя', transcription: '[faːˈmili]', category: 'Люди' },
  { dutch: 'kind', translation: 'дитина', transcription: '[kɪnt]', category: 'Люди' },
  { dutch: 'winkel', translation: 'магазин', transcription: '[ˈʋɪŋkəl]', category: 'Місто' },
  { dutch: 'straat', translation: 'вулиця', transcription: '[straːt]', category: 'Місто' },
  { dutch: 'avond', translation: 'вечір', transcription: '[ˈaːvənt]', category: 'Час' },
  { dutch: 'morgen', translation: 'ранок / завтра', transcription: '[ˈmɔrɣə(n)]', category: 'Час' },
  { dutch: 'eten', translation: 'їжа / їсти', transcription: '[ˈeːtə(n)]', category: 'Базові слова' },
];
