import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseQuery = fetchBaseQuery({ baseUrl: `http://localhost:3000/` })
const baseQuery = fetchBaseQuery({ baseUrl: `https://backend.gta5dm.pro/` })

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({})
})

