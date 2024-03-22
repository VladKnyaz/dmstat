import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: `https://backend.dmstat.pro/` })

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({})
})

