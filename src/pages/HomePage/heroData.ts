export interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
}

export const heroQuotes: Quote[] = [
  {
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    role: 'Entrepreneur & Innovator',
  },
  {
    id: '2',
    text: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis',
    role: 'Author & Scholar',
  },
  {
    id: '3',
    text: 'The journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    role: 'Ancient Chinese Philosopher',
  },
  {
    id: '4',
    text: "Believe you can and you're halfway there.",
    author: 'Theodore Roosevelt',
    role: '26th U.S. President',
  },
  {
    id: '5',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    role: 'British Prime Minister',
  },
];

export const heroImageData = {
  src: '/esmeralda-removebg-preview.png',
  alt: 'Better You - Personal Growth and Self Improvement',
};
