import Phaser from "phaser";

import { sharedConfig } from "../../main";

export interface IMenuItem {
  scene?: string;
  title: string;
  textObject?: Phaser.GameObjects.Text;
}

export class Base extends Phaser.Scene {
  public canvasW: number;
  public canvasH: number;

  public menuCoords: number[];

  public fontColor: string;
  public fontHoverColor: string;
  public fontSize: string;

  public bestScore!: number;

  public isGoBack: boolean | undefined;
  private type: string;

  public bgRect?: Phaser.GameObjects.Rectangle;
  center: [x: number, y: number];

  constructor(type: string, isGoBack?: boolean) {
    super(type);
    this.type = type;
    this.isGoBack = isGoBack;
    this.canvasW = sharedConfig.gameWidth;
    this.canvasH = sharedConfig.gameHeight;
    this.center = [this.canvasW * 0.5, this.canvasH * 0.5];

    this.menuCoords = [this.canvasW * 0.5, this.canvasH * 0.5];

    this.fontSize = "33px";
    this.fontColor = "#fff";
    this.fontHoverColor = "#ffd700";
  }

  public init(): void {
    let scoreFromStorgae = localStorage.getItem("bestScore");
    this.bestScore = scoreFromStorgae ? parseInt(scoreFromStorgae) : 0;

    this.cameras.main.setZoom(1);

    this.physics.world.setFPS(25);
  }

  public create(): void {
    /* BACKGROUND */
    this.add.image(0, 0, "sky").setOrigin(0);

    /*CREATE BACK BUTTON */
    if (this.isGoBack) {
      this.add
        .image(this.canvasW - 10, this.canvasH - 10, "back-btn")
        .setOrigin(1)
        .setScale(2)
        .setInteractive()
        .on("pointerup", () => this.scene.start("Menu"));
    }
  }

  public drawMenu(
    menu: IMenuItem[] | null,
    setMenuEvents: (menuItem: IMenuItem) => void
  ): void {
    if (this.type !== "Menu") {
      this.bgRect = this.add
        .rectangle(0, 0, this.canvasW, this.canvasH, 0x000, 0.3)
        .setOrigin(0);
    }
    if (menu) {
      menu.forEach((menuItem) => {
        menuItem.textObject = this.add
          .text(this.menuCoords[0], this.menuCoords[1] - 50, menuItem.title, {
            fontSize: this.fontSize,
            color: this.fontColor,
          })
          .setOrigin(0.5, 1)
          .setDepth(1)
          .on("pointerover", () => {
            menuItem.textObject?.setStyle({ fill: this.fontHoverColor });
          })
          .on("pointerout", () =>
            menuItem.textObject?.setStyle({ fill: this.fontColor })
          );

        setMenuEvents(menuItem);

        this.menuCoords[1] += 50;
      });
    }

    this.menuCoords[1] = this.canvasH * 0.5;
  }
}
