

export class SceneRepository {

}

/** 
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

**/
