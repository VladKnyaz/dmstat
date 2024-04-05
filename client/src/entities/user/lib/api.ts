import { api } from "../../../shared/api";

const usersApiWithTag = api.enhanceEndpoints({ addTagTypes: ['User'] })

const usersApi = usersApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, string>({
            query: (password) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    password
                }
            }),

        }),
        valid: builder.query<any, void>({
            query: () => ({
                url: '/',
                method: 'GET',

            }),

        }),

    }),
    overrideExisting: true,
})



export const { useLoginMutation, useValidQuery } = usersApi;     
