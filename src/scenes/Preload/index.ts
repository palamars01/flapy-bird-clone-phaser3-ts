import Phaser from "phaser";

export class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    const load = this.load;

    load.image("sky", "assets/sky.png");
    load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    load.image("pipe", "assets/pipe.png");
    load.image("pause-btn", "assets/pause.png");
    load.image("back-btn", "assets/back.png");

    /*LOADING AUDIO ASSETS */
    load.audio(
      "audio",
      "audio/2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3"
    );
    load.audio("flap", "/audio/Retro Swooosh 02.wav");
    load.audio("collide", "/audio/Retro Roar 02.wav");
  }

  create() {
    /* BACKGROUND */
    this.scene.start("Menu");
  }
}
