import { Game } from "../../scenes/Game";

const rndBetween = (min: number, max: number): number =>
  Phaser.Math.Between(min, max);

type Sprite = Phaser.GameObjects.Sprite;

enum Difficulties {
  Easy = 1,
  Normal = 0.75,
  Hard = 0.5,
}

export class PipesGroup extends Phaser.Physics.Arcade.Group {
  private distanceYRange: [number, number];
  private distanceXRange: [number, number];

  private difficultyLevel: number;

  private velocityX: number;

  constructor(public scene: Game) {
    super(scene.physics.world, scene, {
      immovable: true,
    });

    this.difficultyLevel = Difficulties.Easy;

    this.distanceYRange = [200, 300];
    this.distanceXRange = [250, 350];

    this.velocityX = -150;

    this.initPipes();
  }

  private createPipe = (
    x: number,
    y: number,
    origin: number[],
    spriteKey: string = "pipe"
  ): Sprite => this.scene.add.sprite(x, y, spriteKey).setOrigin(...origin);

  private pipesStartPosition: number = this.scene.canvasW * 0.5;
  public initPipes(): void {
    const scene = this.scene;

    const pipesDistY = rndBetween(
      this.distanceYRange[0] * this.difficultyLevel,
      this.distanceYRange[1] * this.difficultyLevel
    );

    const minPipeHeight: number = 50;
    const pipeCoords = {
      x: this.pipesStartPosition,
      y: rndBetween(minPipeHeight, scene.canvasH - minPipeHeight - pipesDistY),
    };

    const { x, y } = pipeCoords;

    const topPipe: Sprite = this.createPipe(x, y, [0, 1]);
    const bottomPipe: Sprite = this.createPipe(x, y + pipesDistY, [0]);

    this.addMultiple([topPipe, bottomPipe], true);

    this.setVelocity(this.velocityX, 0);

    this.pipesStartPosition = scene.canvasW;
  }

  public cyclePipesCreate(): void {
    if (
      this.getLast(true).x <=
      this.scene.canvasW - rndBetween(...this.distanceXRange)
    ) {
      this.initPipes();
    }
  }

  public destroyPipe(): void {
    const firstPipe: Sprite = this.getFirstAlive();

    if (firstPipe.x + firstPipe.width < 0) {
      this.handleScoreUpdate(firstPipe);
      firstPipe.destroy();
    }
  }

  private pipesToDestroy: number = 0;
  private handleScoreUpdate(pipe: Phaser.GameObjects.GameObject) {
    const scene = this.scene;

    this.pipesToDestroy++;
    if (this.pipesToDestroy === 2) {
      scene.score++;

      scene.scoreMessage.setText(`Score: ${this.scene.score}`);
      scene.saveBestScore();

      this.pipesToDestroy = 0;
    }
    this.updateDifficulty();
  }

  private updateDifficulty(): void {
    const scene = this.scene;

    if (scene.score === 5 && this.difficultyLevel === Difficulties.Easy) {
      this.difficultyLevel = Difficulties.Normal;
      this.velocityX *= 1.2;
    } else if (
      scene.score === 10 &&
      this.difficultyLevel === Difficulties.Normal
    ) {
      this.difficultyLevel = Difficulties.Hard;
      this.velocityX *= 1.2;
    }
  }
}
