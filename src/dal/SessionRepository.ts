import type { PrismaClient } from "@prisma/client";
import type { PlayerDTO, SceneDTO, SessionDTO } from "../dto/DataObjects";
import type { ISessionRepository } from "../barel/RepositoryControl";
import type { IdGeneratorService } from "../services/IdGeneratorService";

export class SessionRepository implements ISessionRepository {
  constructor(
    private db: PrismaClient,
    private idGenerator: IdGeneratorService
  ) {}

  async findLatestByPlayer(player: PlayerDTO): Promise<SessionDTO | null> {
    return (await this.db.session.findFirst({
      where: { player: { id: player.id } },
      orderBy: { date: "desc" },
    })) as SessionDTO;
  }

  async findLatestWithSceneByPlayer(
    player: PlayerDTO
  ): Promise<SessionDTO | null> {
    return (await this.db.session.findFirst({
      where: { player: { id: player.id } },
      orderBy: { date: "desc" },
      include: {
        scene: {
          include: {
            dialogs: true,
            actions: { include: { link: true } },
          },
        },
      },
    })) as unknown as SessionDTO;
  }

  async create(player: PlayerDTO): Promise<SessionDTO> {
    return (await this.db.session.create({
      data: {
        player: { connect: { id: player.id } },
        sessionKey: this.idGenerator.generateId(),
      },
    })) as SessionDTO;
  }

  async update(session: SessionDTO, data: Partial<SessionDTO>): Promise<void> {
    if (!data.sceneId) throw new Error("sceneId is mandatory");
    await this.db.session.update({
      where: { id: session.id },
      data: {
        scene: data.sceneId ? { connect: { id: data.sceneId } } : undefined,
      },
    });
  }
}
