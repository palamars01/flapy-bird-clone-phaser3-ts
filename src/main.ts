import Phaser from "phaser";

import { Preload, Menu, Game, BestScore } from "./scenes";

const WIDTH = 400;
const HEIGHT = 500;

const div: HTMLElement = document.querySelector(".info")!;
div.style.width = `${WIDTH}px`;
div.style.height = `${HEIGHT}px`;

const config: Phaser.Types.Core.GameConfig = {
  width: WIDTH,
  height: HEIGHT,
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      //   debug: true,
    },
  },
  audio: {
    disableWebAudio: true,
  },
  scene: [Preload, Menu, Game, BestScore],
};

export default new Phaser.Game(config);
