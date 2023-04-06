import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  reducerPath: "NftApi",
  tagTypes: ["UploadImage", "DalleImage"],
  endpoints: (builder) => ({
    getTwitterImage: builder.mutation({
      query: ({ data }) => ({
        url: "twitter/getImage",
        method: "POST",
        body: data,
      }),
      providesTags: ["UploadImage"],
    }),
    getDalleImage: builder.mutation({
      query: ({ data }) => ({
        url: "openai/dalle",
        method: "POST",
        body: data,
      }),
      providesTags: ["DalleImage"],
    }),
  }),
});

export const { useGetTwitterImageMutation, useGetDalleImageMutation } = api;
