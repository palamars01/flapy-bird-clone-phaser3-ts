import { Base } from "../Base";

export class BestScore extends Base {
  constructor() {
    super("BestScore", true);
  }

  public init(): void {
    super.init();
  }

  public create(): void {
    super.create();

    this.add
      .text(...this.center, `Best Score: ${this.bestScore}`, this.fontConfig)
      .setOrigin(0.5, 1);
  }
}
