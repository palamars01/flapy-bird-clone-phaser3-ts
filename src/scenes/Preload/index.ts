import Phaser from "phaser";

interface StartConfig {
  width: number;
  height: number;
}

export class Preload extends Phaser.Scene {
  canvasW!: number;
  canvasH!: number;
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("top-pipe", "assets/pipe.png");
    this.load.image("bottom-pipe", "assets/pipe.png");
    this.load.image("pause-btn", "assets/pause.png");
    this.load.image("back-btn", "assets/back.png");

    /*LOADING AUDIO ASSETS */
    this.load.audio(
      "audio",
      "audio/2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3"
    );
    this.load.audio("flap", "/audio/Retro Swooosh 02.wav");
    this.load.audio("collide", "/audio/Retro Roar 02.wav");
  }

  create() {
    /* BACKGROUND */
    this.scene.start("Menu");
  }
}
