import { Country } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// I wouldn't use this in a real app, but it's fine for a demo. I didn't want to have to use the fetch API so that I can cache the data. In a real app, I would define a base API and inject the various endpoints per feature
// Examples of these can be found on my github https://github.com/4x3l3r8.

export const CountriesApi = createApi({
  reducerPath: "CountriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json",
  }),
  endpoints: (builder) => ({
    getAllcountries: builder.query<Country[], void>({
      query: () => ``,
    }),
  }),
});

export const { useGetAllcountriesQuery } = CountriesApi;
