import { input, confirm, select } from "@inquirer/prompts";
import { Prisma, PrismaClient } from "@prisma/client";
import type { PlayerDTO, SessionDTO, SceneDTO } from "./dto/DataObjects";
import { IdGeneratorService } from "./services/IdGeneratorService";
import { SceneRepository, SessionRepository } from "./barel/RepositoryControl";
import Narator from "./presentation/Narator";

export defeault class GameInfo {
  private player?: PlayerDTO;
  private session?: SessionDTO;
  private end = false;
  private nextElementScript?: CompleteScene | SceneDTO;

  async init() {
    await Narator.speak("Bienvenue dans l'aventure jeune aventurier !");
    await Narator.speak(
      "Avant de commencer, j'aurais besoin de quelques informations..."
    );

    const playerName = await input({ message: "Entrez votre nom" });
    console.clear();

    let user = await prisma.player.findFirst({ where: { name: playerName } });

    if (!user) {
      user = await prisma.player.create({ data: { name: playerName } });
      this.session = await sessionRepository.create(user);
      this.setPlayer(user);
    } else {
      this.setPlayer(user);
      const continuePrevious = await confirm({
        message:
          "Une session existe déjà pour vous, voulez-vous continuer la précédente ?",
      });
      if (continuePrevious) {
        this.session =
          (await sessionRepository.findLatestWithSceneByPlayer(user)) ??
          undefined;
      } else {
        this.session = await sessionRepository.create(user);
      }
    }

    if (this.session?.scene) {
      this.nextElementScript = this.session.scene;
    } else {
      await this.setDefaultScene();
    }

    await Narator.speak(`Ah, heureux de vous rencontrer ${playerName} !`);
  }

  async setNextElementScript(sceneId: string) {
    if (sceneId === actionsTypes.sq) {
      return this.setEnd();
    }
  
    if (!this.session) throw new Error("No session found");
  
    await sessionRepository.update(this.session, { sceneId });
  
    const scene = await sceneRepository.findById(sceneId);
    if (!scene) {
      this.nextElementScript = undefined;
      throw new Error("No scene found");
    }
  
    this.nextElementScript = scene;
  }

  private async setDefaultScene() {
    this.nextElementScript = await sceneRepository.findDefault();
  }
  

  setPlayer(player: PlayerDTO) {
    this.player = player;
  }

  getSession() {
    return this.session;
  }

  getPlayer() {
    return this.player;
  }

  getNextScript() {
    return this.nextElementScript;
  }

  setEnd() {
    this.end = true;
  }

  hasEnded() {
    return this.end;
  }
}
async function turn({ gameInfo }: { gameInfo: GameInfo }) {
  console.clear();
  const scene = gameInfo.getNextScript();
  if (!scene) throw new Error("No scene found session might be corrupted");

  for (const dialog of scene.dialogs) {
    await Narator.dialog(dialog.content, dialog.speaker as dialogType);
  }

  const answer = await select(
    {
      message: "Quelle action souhaitez-vous effectuer ?",
      choices: scene.actions.map((item) => {
        return {
          name: item.content,
          value: item.link.id,
        };
      }),
    },
    {
      clearPromptOnDone: true,
    }
  );

  await gameInfo.setNextElementScript(answer);
  return;
}
