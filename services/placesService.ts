import type { Place } from '../types';

const mockPlaces: Place[] = [
  {
    id: '1',
    displayName: { text: '新宿ゴールデン街の隠れ家バー', languageCode: 'ja' },
    formattedAddress: '東京都新宿区歌舞伎町1-1-1',
    googleMapsUri: 'https://maps.google.com/?cid=11111',
    rating: 4.8,
    userRatingCount: 850,
    reviewSummary: { text: '雰囲気が最高で、カクテルの種類も豊富。マスターの人柄も良い。', languageCode: 'ja' }
  },
  {
    id: '2',
    displayName: { text: 'Shinjuku Ramen Master', languageCode: 'en' },
    formattedAddress: '1-2-2 Kabukicho, Shinjuku, Tokyo',
    googleMapsUri: 'https://maps.google.com/?cid=22222',
    rating: 4.5,
    userRatingCount: 1200,
    reviewSummary: { text: 'Best tonkotsu ramen in town! The broth is rich and the noodles are perfect. Expect a long queue during peak hours.', languageCode: 'en' }
  },
  {
    id: '3',
    displayName: { text: '古き良き喫茶店 新宿', languageCode: 'ja' },
    formattedAddress: '東京都新宿区西新宿2-1-1',
    googleMapsUri: 'https://maps.google.com/?cid=33333',
    rating: 4.2,
    userRatingCount: 250,
  },
    {
    id: '4',
    displayName: { text: '歌舞伎町 中華料理', languageCode: 'ja' },
    formattedAddress: '東京都新宿区歌舞伎町周辺',
    googleMapsUri: 'https://maps.google.com/?cid=44444&unclaimed=true', // This one is unclaimed
    rating: 3.5,
    userRatingCount: 15,
    reviewSummary: { text: '味は普通。', languageCode: 'ja' }
  },
  {
    id: '5',
    displayName: { text: '西新宿の小さな本屋', languageCode: 'ja' },
    formattedAddress: '東京都新宿区西新宿',
    googleMapsUri: 'https://maps.google.com/?cid=55555&unclaimed=true', // This one is also unclaimed
    userRatingCount: 2,
  },
];

export const searchPlaces = async (textQuery: string): Promise<Place[]> => {
  console.log(`Searching for "${textQuery}"...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!textQuery) {
    return [];
  }

  // In a real application, you would make an API call here.
  // For this demo, we return mock data.
  return JSON.parse(JSON.stringify(mockPlaces)); // Return a deep copy
};
