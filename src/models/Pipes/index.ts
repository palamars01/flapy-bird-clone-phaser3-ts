import { Game } from "../../scenes/Game";

import rndBetween from "../../scenes/Game/randomBetween";

enum Difficulties {
  Easy = 1,
  Normal = 0.75,
  Hard = 0.5,
}

export class Pipes {
  private scene: Game;

  private pipesGroup!: Phaser.Physics.Arcade.Group;
  private topPipe!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private bottomPipe!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;

  private pipesDistX!: number;
  private pipesDistYRange: [number, number];
  private pipesDistXRange: [number, number];

  private difficultyLevel: number;

  private minPipeHeight: number;
  private pipeVelocityX: number;

  constructor(scene: Game) {
    this.scene = scene;
    this.pipesGroup = scene.physics.add.group();

    this.pipesDistX = -this.scene.canvasW * 0.2; // First pipe start position

    this.pipesDistYRange = [300, 400];
    this.pipesDistXRange = [250, 350];

    this.minPipeHeight = 50;
    this.pipeVelocityX = -150;

    this.difficultyLevel = Difficulties.Easy;
  }

  //   private createPipes(x:number,y:number,pipesDistY:number):Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody[]{

  //     return [this.topPipe,this.bottomPipe]
  //   }

  public createPipesGroup(): Phaser.Physics.Arcade.Group {
    const pipesDistY = rndBetween(
      this.pipesDistYRange[0] * this.difficultyLevel,
      this.pipesDistYRange[1] * this.difficultyLevel
    );

    const pipeCoords = {
      x: this.scene.canvasW + this.pipesDistX,
      y: rndBetween(
        this.minPipeHeight,
        this.scene.canvasH - this.minPipeHeight - pipesDistY
      ),
    };

    const { x, y } = pipeCoords;

    this.topPipe = this.pipesGroup.create(x, y, "top-pipe").setOrigin(0, 1);

    this.topPipe.body.setImmovable(true);

    this.bottomPipe = this.pipesGroup
      .create(x, y + pipesDistY, "bottom-pipe")
      .setOrigin(0);

    this.bottomPipe.body.setImmovable(true);

    this.pipesGroup.setVelocity(this.pipeVelocityX, 0);

    this.pipesDistX = 0;

    return this.pipesGroup;
  }

  public cyclePipesCreate(): void {
    if (
      this.pipesGroup.getLast(true).x <=
      this.scene.canvasW - rndBetween(...this.pipesDistXRange)
    ) {
      this.createPipesGroup();
    }
  }

  public destroyPipe(): void {
    this.pipesGroup
      .getChildren()
      .forEach((pipe: Phaser.GameObjects.GameObject): void => {
        if (pipe.body.position.x < -this.topPipe.body.width) {
          this.handleScoreUpdate(pipe);
          pipe.destroy();
        }
      });
  }

  private pipes: Phaser.GameObjects.GameObject[] = [];
  private handleScoreUpdate(pipe: Phaser.GameObjects.GameObject) {
    this.pipes.push(pipe);
    if (this.pipes.length === 2) {
      this.scene.score++;

      this.scene.scoreMessage.setText(`Score: ${this.scene.score}`);
      this.scene.saveBestScore();

      this.pipes = [];
    }
    this.updateDifficulty();
  }

  private updateDifficulty(): void {
    if (this.scene.score === 5 && this.difficultyLevel === Difficulties.Easy) {
      this.difficultyLevel = Difficulties.Normal;
      this.pipeVelocityX *= 1.2;
    } else if (
      this.scene.score === 10 &&
      this.difficultyLevel === Difficulties.Normal
    ) {
      this.difficultyLevel = Difficulties.Hard;
      this.pipeVelocityX *= 1.2;
    }
  }
}
