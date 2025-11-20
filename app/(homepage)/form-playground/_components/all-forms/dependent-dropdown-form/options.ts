export const countryOptions = [
  { value: 'bd', label: 'Bangladesh' },
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
];

export interface ICityOptions {
  [key: string]: {
    value: string;
    label: string;
  }[];
}
export const cityOptions: ICityOptions = {
  bd: [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'sylhet', label: 'Sylhet' },
  ],

  in: [
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bangalore', label: 'Bangalore' },
  ],

  us: [
    { value: 'new_york', label: 'New York' },
    { value: 'los_angeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
  ],

  ca: [
    { value: 'toronto', label: 'Toronto' },
    { value: 'vancouver', label: 'Vancouver' },
    { value: 'montreal', label: 'Montreal' },
  ],

  au: [
    { value: 'sydney', label: 'Sydney' },
    { value: 'melbourne', label: 'Melbourne' },
    { value: 'brisbane', label: 'Brisbane' },
  ],
};
