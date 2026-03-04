export interface WordCard {
  dutch: string;
  translation: string;
  category: string;
}

export const starterWords: WordCard[] = [
  { dutch: 'huis', translation: 'будинок', category: 'Побут' },
  { dutch: 'deur', translation: 'двері', category: 'Побут' },
  { dutch: 'water', translation: 'вода', category: 'Побут' },
  { dutch: 'brood', translation: 'хліб', category: 'Їжа' },
  { dutch: 'melk', translation: 'молоко', category: 'Їжа' },
  { dutch: 'appel', translation: 'яблуко', category: 'Їжа' },
  { dutch: 'fiets', translation: 'велосипед', category: 'Транспорт' },
  { dutch: 'trein', translation: 'поїзд', category: 'Транспорт' },
  { dutch: 'werk', translation: 'робота', category: 'Робота' },
  { dutch: 'kantoor', translation: 'офіс', category: 'Робота' },
  { dutch: 'school', translation: 'школа', category: 'Навчання' },
  { dutch: 'boek', translation: 'книга', category: 'Навчання' },
  { dutch: 'vriend', translation: 'друг', category: 'Люди' },
  { dutch: 'familie', translation: 'сімʼя', category: 'Люди' },
  { dutch: 'kind', translation: 'дитина', category: 'Люди' },
  { dutch: 'winkel', translation: 'магазин', category: 'Місто' },
  { dutch: 'straat', translation: 'вулиця', category: 'Місто' },
  { dutch: 'avond', translation: 'вечір', category: 'Час' },
  { dutch: 'morgen', translation: 'ранок / завтра', category: 'Час' },
  { dutch: 'eten', translation: 'їжа / їсти', category: 'Базові слова' },
];
