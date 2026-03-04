export interface WordCard {
  dutch: string;
  transcription: string;
  translation: string;
  category: string;
}

export const starterWords: WordCard[] = [
  { dutch: 'huis', transcription: '[hœys]', translation: 'будинок', category: 'Побут' },
  { dutch: 'deur', transcription: '[døːr]', translation: 'двері', category: 'Побут' },
  { dutch: 'water', transcription: '[ˈʋaːtər]', translation: 'вода', category: 'Побут' },
  { dutch: 'brood', transcription: '[broːt]', translation: 'хліб', category: 'Їжа' },
  { dutch: 'melk', transcription: '[mɛlk]', translation: 'молоко', category: 'Їжа' },
  { dutch: 'appel', transcription: '[ˈɑpəl]', translation: 'яблуко', category: 'Їжа' },
  { dutch: 'fiets', transcription: '[fits]', translation: 'велосипед', category: 'Транспорт' },
  { dutch: 'trein', transcription: '[trɛin]', translation: 'поїзд', category: 'Транспорт' },
  { dutch: 'werk', transcription: '[ʋɛrk]', translation: 'робота', category: 'Робота' },
  { dutch: 'kantoor', transcription: '[kɑnˈtoːr]', translation: 'офіс', category: 'Робота' },
  { dutch: 'school', transcription: '[sxoːl]', translation: 'школа', category: 'Навчання' },
  { dutch: 'boek', transcription: '[buk]', translation: 'книга', category: 'Навчання' },
  { dutch: 'vriend', transcription: '[vrint]', translation: 'друг', category: 'Люди' },
  { dutch: 'familie', transcription: '[faːˈmili]', translation: 'сімʼя', category: 'Люди' },
  { dutch: 'kind', transcription: '[kɪnt]', translation: 'дитина', category: 'Люди' },
  { dutch: 'winkel', transcription: '[ˈʋɪŋkəl]', translation: 'магазин', category: 'Місто' },
  { dutch: 'straat', transcription: '[straːt]', translation: 'вулиця', category: 'Місто' },
  { dutch: 'avond', transcription: '[ˈaːvɔnt]', translation: 'вечір', category: 'Час' },
  { dutch: 'morgen', transcription: '[ˈmɔrɣən]', translation: 'ранок / завтра', category: 'Час' },
  { dutch: 'eten', transcription: '[ˈeːtə(n)]', translation: 'їжа / їсти', category: 'Базові слова' },
];
