import Phaser from "phaser";

export interface IMenuItem {
  scene?: string;
  title: string;
  textObject?: Phaser.GameObjects.Text;
}

export class Base extends Phaser.Scene {
  public canvasW!: number;
  public canvasH!: number;

  public menuCoords!: [number, number];

  public fontConfig: {
    fontColor: string;
    fontHoverColor: string;
    fontSize: string;
  };

  public bestScore!: number;

  public bgRect?: Phaser.GameObjects.Rectangle;
  public center!: [x: number, y: number];

  constructor(private sceneKey: string, private isGoBack?: boolean) {
    super(sceneKey);
    this.fontConfig = {
      fontSize: "32px",
      fontColor: "#fff",
      fontHoverColor: "#ffd700",
    };
  }

  public init(): void {
    let scoreFromStorgae = localStorage.getItem("bestScore");
    this.bestScore = scoreFromStorgae ? parseInt(scoreFromStorgae) : 0;

    this.canvasW = this.game.canvas.width;
    this.canvasH = this.game.canvas.height;

    this.center = [this.canvasW * 0.5, this.canvasH * 0.5];
    this.menuCoords = [...this.center];

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
    const fontConfig = this.fontConfig;

    if (this.sceneKey !== "Menu") {
      this.bgRect = this.add
        .rectangle(0, 0, this.canvasW, this.canvasH, 0x000, 0.3)
        .setOrigin(0);
    }

    const onPointerHandler = (menuItem: IMenuItem, fillColor: string): void => {
      menuItem.textObject?.setStyle({
        fill: fillColor,
      });
    };

    if (menu) {
      menu.forEach((menuItem) => {
        menuItem.textObject = this.add
          .text(...this.menuCoords, menuItem.title, fontConfig)
          .setOrigin(0.5, 1)
          .setDepth(1)
          .on("pointerover", () =>
            onPointerHandler(menuItem, fontConfig.fontHoverColor)
          )
          .on("pointerout", () =>
            onPointerHandler(menuItem, fontConfig.fontColor)
          );

        setMenuEvents(menuItem);

        this.menuCoords[1] += 50;
      });
    }

    this.menuCoords[1] = this.canvasH * 0.5;
  }
}
