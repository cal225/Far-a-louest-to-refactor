import type { SessionDTO, PlayerDTO } from "../tdo/DataObjects";

export interface ISessionRepository {
  // Finds the latest session for a player, or null if no session exists
  findLatestByPlayer(player: PlayerDTO): Promise<SessionDTO | null>;

  // Finds the latest session for a player, including the associated scene and actions
  findLatestWithSceneByPlayer(player: PlayerDTO): Promise<SessionDTO | null>;

  // Creates a new session for a player and returns the created session
  create(player: PlayerDTO): Promise<SessionDTO>;

  // Updates an existing session with the provided data
  update(session: SessionDTO, data: Partial<SessionDTO>): Promise<void>;
}
