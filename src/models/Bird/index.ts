import { Game } from "../../scenes/Game";

type CollisionObject = Phaser.GameObjects.Group;

export class Bird extends Phaser.Physics.Arcade.Sprite {
  birdGravityY: number;
  flapVelocityY: number;

  constructor(public scene: Game, x: number, y: number, spriteKey: string) {
    super(scene, x, y, "bird", 8);

    this.birdGravityY = 600;
    this.flapVelocityY = 300;

    this.init();
  }

  private init(): void {
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setFlipX(true);
    this.setScale(3);

    this.setBodySize(15, 8);
    this.setGravityY(this.birdGravityY);

    this.createAnimations();
  }

  private createAnimations(): void {
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 8,
        end: 15,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  public flap = (): void => {
    const scene = this.scene;
    if (!scene.isGameOver && !scene.isGamePaused) {
      this.setVelocityY(-this.flapVelocityY);
      scene.sound.play("flap", { volume: 0.1 });
      this.play("fly");
    }
  };

  public checkBirdPosition(): void {
    const scene = this.scene;
    if (this.y < 0 || this.y > scene.canvasH + this.height * 0.5) {
      if (!scene.isGameOver) {
        scene.isGameOver = true;
        scene.gameStateControls.gameOver();
      }
    }
  }
  public addCollider(
    collisionObj: CollisionObject,
    cb?: ArcadePhysicsCallback | undefined
  ): void {
    this.scene.physics.add.collider(this, collisionObj, cb);
  }
}
