export interface SentenceVerb {
  infinitive: string;
  imperfectum: string;
  perfectum: string;
}

export const sentenceBuilderVerbs: SentenceVerb[] = [
  { infinitive: 'werken', imperfectum: 'werkte', perfectum: 'gewerkt' },
  { infinitive: 'maken', imperfectum: 'maakte', perfectum: 'gemaakt' },
  { infinitive: 'leren', imperfectum: 'leerde', perfectum: 'geleerd' },
  { infinitive: 'wonen', imperfectum: 'woonde', perfectum: 'gewoond' },
  { infinitive: 'koken', imperfectum: 'kookte', perfectum: 'gekookt' },
  { infinitive: 'spelen', imperfectum: 'speelde', perfectum: 'gespeeld' },
  { infinitive: 'praten', imperfectum: 'praatte', perfectum: 'gepraat' },
  { infinitive: 'reizen', imperfectum: 'reisde', perfectum: 'gereisd' },
  { infinitive: 'fietsen', imperfectum: 'fietste', perfectum: 'gefietst' },
  { infinitive: 'studeren', imperfectum: 'studeerde', perfectum: 'gestudeerd' },
  { infinitive: 'wandelen', imperfectum: 'wandelde', perfectum: 'gewandeld' },
  { infinitive: 'wassen', imperfectum: 'waste', perfectum: 'gewassen' },
  { infinitive: 'stofzuigen', imperfectum: 'stofzuigde', perfectum: 'gestofzuigd' },
  { infinitive: 'schilderen', imperfectum: 'schilderde', perfectum: 'geschilderd' },
  { infinitive: 'luisteren', imperfectum: 'luisterde', perfectum: 'geluisterd' },
  { infinitive: 'oefenen', imperfectum: 'oefende', perfectum: 'geoefend' },
  { infinitive: 'bellen', imperfectum: 'belde', perfectum: 'gebeld' },
  { infinitive: 'antwoorden', imperfectum: 'antwoordde', perfectum: 'geantwoord' },
  { infinitive: 'kamperen', imperfectum: 'kampeerde', perfectum: 'gekampeerd' },
  { infinitive: 'trainen', imperfectum: 'trainde', perfectum: 'getraind' },
];

export interface SelfLatenPair {
  goal: string;
  correctSentence: string;
}

export const selfLatenPairs: SelfLatenPair[] = [
  { goal: 'I do it myself', correctSentence: 'Ik was mijn auto zelf.' },
  { goal: 'I let someone do it', correctSentence: 'Ik laat mijn auto wassen.' },
  { goal: 'I paint my room myself', correctSentence: 'Ik schilder mijn kamer zelf.' },
  { goal: 'I let someone paint my room', correctSentence: 'Ik laat mijn kamer schilderen.' },
  { goal: 'I clean the kitchen myself', correctSentence: 'Ik maak de keuken zelf schoon.' },
  { goal: 'I let someone clean the kitchen', correctSentence: 'Ik laat de keuken schoonmaken.' },
];
