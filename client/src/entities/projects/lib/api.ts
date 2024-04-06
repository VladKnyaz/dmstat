import { api } from "../../../shared/api";

export interface IPlayersInfoAmount {
    amount: number;
    peak: number;
    max: number;
}

export interface IProjectCurrentOnline {
    projectName: string,
    projectId: string,
    currentOnline: number,
    time: string,
    color: string
}

export interface IProject {
    id: number;
    projectId: string;
    projectName: string;
    color: string;
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


export type IProjectInfo = { time: Date | string; } & {
    [key: string]: string | number;
}

const projectsApiWithTag = api.enhanceEndpoints({ addTagTypes: ['Project', 'ProjectCurrent'] })

const projectsApi = projectsApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<IProjectInfo[], IGetProjects>({
            query: (params) => ({
                url: '/projects',
                method: 'GET',
                params: {
                    isRelations: params?.isRelations
                }

            }),
            providesTags: ['Project']
        }),
        getProjectsMainInfo: builder.query<IProject[], void>({
            query: () => ({
                url: '/projects/main',
                method: 'GET',
            }),
        }),
        addProject: builder.mutation<IProject, IAddProject>({
            query: (body) => ({
                url: '/projects/create',
                method: "POST",
                body
            }),
            invalidatesTags: ['Project', 'ProjectCurrent']
        }),
        deleteProject: builder.mutation<IProject, string>({

            query: (projectName) => ({
                url: '/projects/delete',
                method: "DELETE",
                body: {
                    projectName
                }
            }),
            invalidatesTags: ['Project', 'ProjectCurrent']
        }),
        getProject: builder.query<IProject, IFindProject>({
            query: (body) => ({
                url: `/projects/${body.projectName}`,
                method: "GET",

            })
        }),
        getProjectsCurrent: builder.query<IProjectCurrentOnline[], void>({
            query: () => ({
                url: `/projects/get/current`,
                method: "GET",
            }),
            providesTags: ['ProjectCurrent']
        }),
    }),
    overrideExisting: true,
})



export const { useGetProjectsQuery, useAddProjectMutation, useDeleteProjectMutation, useGetProjectQuery, useGetProjectsCurrentQuery, useGetProjectsMainInfoQuery } = projectsApi;     
