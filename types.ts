export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const professions = [
  'Policeman', 'Firefighter', 'Military', 'Scientist', 'Businessman', 
  'Programmer', 'Painter', 'Rock Star', 'Musician', 'Astronaut', 
  'Dancer', 'Ballet Dancer', 'Singer', 'Diver', 'Builder',
  'Doctor', 'Nurse', 'Engineer', 'Supermarket Cashier', 'Fashion Designer', 'Farmer'
] as const;

export type Profession = typeof professions[number];
