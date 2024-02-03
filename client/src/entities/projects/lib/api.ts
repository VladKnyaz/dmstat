import { api } from "../../../shared/api";

export interface IPlayersInfoAmount {
    amount: number;
    peak: number;
    max: number;
}

export interface IProject {
    id: number;
    projectName: string;
    color: string;
    servers?: IServer[];
    timestamps?: {
        id: number;
        date: string;
        peak: number;
    }[];
}

export interface IServer {
    id: string;
    serverId: string;
    serverName: string;
    timestamps?: {
        id: number;
        date: string;
        amountPlayers: number;
    }[];
}

export interface IAddProject {
    projectName: string;
    color: string;
}

export interface IFindProject {
    projectName?: string;
}

interface IGetProjects {
    isRelations?: boolean
}


const projectsApiWithTag = api.enhanceEndpoints({ addTagTypes: ['Project'] })

const projectsApi = projectsApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<IProject[], IGetProjects>({
            query: (params) => ({
                url: '/projects',
                method: 'GET',
                params: {
                    isRelations: params?.isRelations
                }

            }),
            providesTags: ['Project']
        }),
        addProject: builder.mutation<IProject, IAddProject>({
            query: (body) => ({
                url: '/projects/create',
                method: "POST",
                body
            }),
            invalidatesTags: ['Project']
        }),
        deleteProject: builder.mutation<IProject, string>({

            query: (projectName) => ({
                url: '/projects/delete',
                method: "DELETE",
                body: {
                    projectName
                }
            }),
            invalidatesTags: ['Project']
        }),
        getProject: builder.query<IProject, IFindProject>({
            query: (body) => ({
                url: `/projects/${body.projectName}`,
                method: "GET",

            })
        }),
    }),
    overrideExisting: true,
})



export const { useGetProjectsQuery, useAddProjectMutation, useDeleteProjectMutation, useGetProjectQuery } = projectsApi;     
