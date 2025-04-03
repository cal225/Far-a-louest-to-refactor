import type { PrismaClient } from "@prisma/client";
import type { ISceneRepository } from "../barel/RepositoryControl";
import type { SceneDTO } from "../dto/DataObjects";

export class SceneRepository implements ISceneRepository {
  constructor(private db: PrismaClient) {}

  async findById(sceneId: string): Promise<SceneDTO | null> {
    return (await this.db.scene.findUnique({
      where: { id: sceneId },
      include: {
        dialogs: true,
        actions: { include: { link: true } },
      },
    })) as SceneDTO | null;
  }

  async findDefault(): Promise<SceneDTO> {
    const defaultScene = await this.db.scene.findUnique({
      where: { id: "default" },
      include: {
        dialogs: true,
        actions: { include: { link: true } },
      },
    });

    if (!defaultScene) {
      throw new Error("No default scene found, have you run the seed script?");
    }

    return defaultScene as unknown as SceneDTO;
  }
}
