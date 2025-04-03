export interface PlayerDTO {
  id: string;
  name: string;
}

export interface SessionDTO {
  id: string;
  sessionKey: string;
  date: Date;
  scene: SceneDTO;
  sceneId: string;
  playerId: string;
  player: PlayerDTO;
}

export interface SceneDTO {
  id: string;
  type: string;
  dialogs: DialogDTO[];
  actions: ActionDTO[];
}

export interface DialogDTO {
  id: string;
  speaker: string;
  content: string;
  scene: SceneDTO;
  sceneId: string | null;
}

export interface ActionDTO {
  id: string;
  type: string;
  content: string;
  actionId: string;
  scene: SceneDTO;
  link: { id: string };
}
