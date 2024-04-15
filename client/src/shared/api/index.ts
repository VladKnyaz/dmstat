import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "universal-cookie";
const cookies = new Cookies();


const url = 'https://backend.gta5dm.pro/'
// const url = 'http://localhost:3000/'

const baseQuery = fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers) => {
        let token = cookies.get('token');

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers
    },
    responseHandler: async (response) => {

        return response.json()
    },
})


export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({}),

})