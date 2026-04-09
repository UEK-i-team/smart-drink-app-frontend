import { Drink } from '../types/drink';

export const SAMPLE_DRINKS: Drink[] = [
  {
    id: 'mojito-classic',
    name: 'Mojito',
    description: 'Orzeźwiający kubański koktajl z miętą i limonką.',
    flavorProfile: 'Sweet',
    strength: 'Medium',
    imageUrl:
      'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80',
    imageDescription: 'A tall glass filled with ice, fresh mint leaves, and bubbling liquid with a lime wedge.',
    ingredients: ['50ml białego rumu', '30ml soku z limonki', '10ml syropu cukrowego', '6-8 listków mięty', 'woda gazowana'],
    instructions: [
      'Utrzyj liście mięty z sokiem z limonki i syropem w szklance.',
      'Dodaj rum oraz kostki lodu, delikatnie wymieszaj.',
      'Dopełnij wodą gazowaną i wymieszaj łyżką barmańską.',
      'Udekoruj gałązką mięty oraz ćwiartką limonki.',
    ],
  },
  {
    id: 'old-fashioned-classic',
    name: 'Old Fashioned',
    description: 'Klasyczny koktajl whisky z bitterami i cukrem.',
    flavorProfile: 'Dry',
    strength: 'High',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    imageDescription: 'A lowball glass with amber liquid over a large ice cube, orange peel twist.',
    ingredients: ['60ml bourbona', '1 kostka cukru', '2 krople bittersów Angostura', 'skórka pomarańczy'],
    instructions: [
      'Utrzyj kostkę cukru z bitterami.',
      'Dodaj bourbon i lód, mieszaj przez 30 sekund.',
      'Udekoruj skórką pomarańczy.',
    ],
  },
  {
    id: 'aperol-spritz-classic',
    name: 'Aperol Spritz',
    description: 'Włoski aperitif, lekki i musujący.',
    flavorProfile: 'Semi_sweet',
    strength: 'Low',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    imageDescription: 'A wine glass with bright orange cocktail, ice cubes, and an orange slice.',
    ingredients: ['60ml Aperol', '90ml Prosecco', '30ml wody gazowanej', 'plasterek pomarańczy'],
    instructions: [
      'Napełnij kieliszek lodem.',
      'Dodaj Aperol i Prosecco.',
      'Dopełnij wodą gazowaną i udekoruj pomarańczą.',
    ],
  },
];
