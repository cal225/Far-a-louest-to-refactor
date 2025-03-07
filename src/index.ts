import { input, confirm, select } from "@inquirer/prompts";
import { ChalkInstance } from "chalk";
import { Prisma, PrismaClient } from "@prisma/client";
import Narator from "./presentation/Narator";
import { SessionRepository } from "./repository/SessionRepository";
import type { PlayerDTO, SessionDTO, SceneDTO } from "./tdo/DataObjects";
import { IdGeneratorService } from "./services/IdGeneratorService";

export const enum actionsTypes {
  msg = "msg",
  room = "room",
  action = "action",
  sq = "quit",
}

export enum dialogType {
  self = "self",
  pnj = "pnj",
  narrator = "narrator",
}
const prisma = new PrismaClient();
const sessionRepository = new SessionRepository(
  prisma,
  new IdGeneratorService()
);

class GameInfo {
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
          (await sessionRepository.findLatestWithSceneByPlayer(user)) ?? undefined;
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

    // Find the scene and handle potential null return
    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: {
        dialogs: true,
        actions: { include: { link: true } },
      },
    });

    // If no scene is found, set nextElementScript to undefined
    if (!scene) {
      this.nextElementScript = undefined;
      throw new Error("No scene found");
    }

    // Ensure the scene is assigned correctly
    this.nextElementScript = scene; // Type assertion since we know it's not null here
  }
  

  private async setDefaultScene() {
    const defaultScene = await prisma.scene.findUnique({
      where: { id: "default" },
      include: {
        dialogs: true,
        actions: {
          include: { link: true },
        },
      },
    });

    if (!defaultScene)
      throw new Error("No default scene found, have you ran the seed script ?");
    this.nextElementScript = defaultScene;
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
  if (!scene) throw new Error('No scene found session might be corrupted');

  for (const dialog of scene.dialogs) {
    await Narator.dialog(dialog.content, dialog.speaker as dialogType);
  }

  const answer = await select(
    {
      message: 'Quelle action souhaitez-vous effectuer ?',
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


async function main() {
  try {
    console.clear();
    const gameInfo = new GameInfo();
    await gameInfo.init();
    while (!gameInfo.hasEnded()) {
      console.log(gameInfo.hasEnded());
      await turn({ gameInfo });
    }
  } catch (error) {
    console.error(error);
  }
}

await main();

// J'ai besoin de définir une structure qui me permet de gérer un tour et de récupérer le prochain tour

type CompleteScene = Prisma.SceneGetPayload<{
  include: {
    dialogs: true;
    actions: {
      include: {
        link: true;
      };
    };
  };
}>;

type CompleteSession = Prisma.SessionGetPayload<{
  include: {
    scene: {
      include: {
        dialogs: true;
        actions: {
          include: {
            link: true;
          };
        };
      };
    };
  };
}>;

async function typeWriterEffect(
  text: string,
  speed: number,
  decorator: ChalkInstance
) {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (const char of text) {
    process.stdout.write(decorator(char));
    await delay(speed);
  }
  console.log(); // Move to the next line after typing is complete
}
