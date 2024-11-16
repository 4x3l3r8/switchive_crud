export type TableDataPrimitiveObject = object & { id: number | string };

export type Hotel = { id: number; hotelName: string; address: string; country: string; category: number };

export type Country = { country: string; geonameid: number; name: string; subcountry: string };
