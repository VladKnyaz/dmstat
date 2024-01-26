export interface IPlayersInfoAmount {
  amount: number;
  peak: number;
  max: number;
}

export interface IProject {
  id: string;
  servers: IServerFromRagemp[];
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
