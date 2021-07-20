import { Game } from "../../scenes/Game";

export class Bird {
  scene: Game;

  bird!: Phaser.Physics.Arcade.Sprite;
  birdCoords: { x: number; y: number };
  birdGravityY: number;
  flapVelocityY: number;
  isGameOver!: boolean;

  constructor(scene: Game) {
    this.scene = scene;
    this.birdCoords = {
      x: this.scene.canvasW * 0.1,
      y: this.scene.center[1],
    };

    this.birdGravityY = 600;
    this.flapVelocityY = 300;
  }

  createBird(): Phaser.Physics.Arcade.Sprite {
    this.isGameOver = false;
    this.bird = this.scene.physics.add
      .sprite(this.birdCoords.x, this.birdCoords.y, "bird", 10)
      .setFlipX(true)
      .setScale(3)
      .setBodySize(16, 10);

    this.bird.setGravityY(this.birdGravityY);

    this.createAnimations();

    return this.bird;
  }

  private createAnimations(): void {
    this.bird.anims.create({
      key: "fly",
      frames: this.scene.anims.generateFrameNumbers("bird", {
        start: 8,
        end: 15,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  flap = (): void => {
    if (!this.isGameOver && !this.scene.isGamePaused) {
      this.bird.setVelocityY(-this.flapVelocityY);
      this.scene.sound.play("flap", { volume: 0.1 });
      this.bird.play("fly");
    }
  };

  checkBirdPosition() {
    if (
      this.bird.y < -this.bird.height * 0.5 ||
      this.bird.y > this.scene.canvasH + this.bird.height * 0.5
    ) {
      if (!this.isGameOver) {
        this.isGameOver = true;
        this.scene.gameStateControls.gameOver();
      }
    }
  }
}
