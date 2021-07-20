import { Base } from "../Base";

import { IMenuItem } from "../Base";

export class Menu extends Base {
  private menu: IMenuItem[];

  constructor() {
    super("Menu");
    this.menu = [
      { scene: "Game", title: "Play" },
      { scene: "BestScore", title: "Score" },
      { title: "Quit" },
    ];
  }

  public create() {
    super.create();

    this.drawMenu(this.menu, this.setupMenuEvents);
  }

  private setupMenuEvents = (menuItem: IMenuItem): void => {
    let textObj = menuItem.textObject;
    textObj
      ?.setInteractive()
      ?.on("pointerup", () => this.scene.start(menuItem.scene ?? ""));

    if (menuItem.title === "Quit") {
      textObj?.setInteractive()?.on("pointerup", () => this.game.destroy(true));
    }
  };
}
