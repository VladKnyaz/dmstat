export interface IPlayersInfoAmount {
  amount: number;
  peak: number;
  max: number;
}

export interface IProject {
  id: string;
  servers: IServerFromRagemp[];
  projectId: string; 
  gamemode: string;
  url: string;
  lang: string[];
  players: IPlayersInfoAmount;
  idInDatabase?: number;
}

export interface IServerFromRagemp {
  id: string;
  name: string;
  lang: string[];
  players: IPlayersInfoAmount;
  idInDatabase?: number;
}

export interface IProjectCurrentOnline {
  projectName: string,
  projectId: string,
  currentOnline: number,
  time: string,
  color: string
}