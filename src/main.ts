import Phaser from "phaser";

import { Preload, Menu, Game, BestScore } from "./scenes";



export const sharedConfig={
    gameWidth:400,
    gameHeight:600
}

const div: HTMLElement = document.querySelector(".info")!;
div.style.width = `${sharedConfig.gameWidth}px`;
div.style.height = `${sharedConfig.gameHeight}px`;

const config: Phaser.Types.Core.GameConfig = {
  width: sharedConfig.gameWidth,
  height: sharedConfig.gameHeight,
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
