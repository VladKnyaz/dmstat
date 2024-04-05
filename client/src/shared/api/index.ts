import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "universal-cookie";
const cookies = new Cookies();

// console.log(cookies.get('myCat')); // Pacman
// cookies.set('fdsfds', 'dasda', {
// })

// console.log(cookies.get('23423')); // Pacman

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/`,
    prepareHeaders: (headers, getState) => {
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
// const baseQuery = fetchBaseQuery({ baseUrl: `https://backend.gta5dm.pro/` })

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({}),

})