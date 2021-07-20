import { IMenuItem } from "./../Base";
import { Base } from "../Base";

import { Pipes, Bird } from "../../models";
import { GameStateControls } from "../../controls/GameStateControls";

export class Game extends Base {
  isGamePaused!: boolean;

  private obstacles!: Pipes;
  private pipesGroup!: Phaser.Physics.Arcade.Group;

  player!: Bird;
  bird!: Phaser.Physics.Arcade.Sprite;

  score!: number;
  scoreMessage!: Phaser.GameObjects.Text;
  currentBestScore!: number;

  pauseButton!: Phaser.GameObjects.Image;

  menu!: IMenuItem[];
  private countDownMessage!: Phaser.GameObjects.Text | null;
  private timeToStart!: number;
  private timer!: Phaser.Time.TimerEvent | null;
  gameStateControls!: GameStateControls;

  constructor() {
    super("Game");
  }

  public init(): void {
    super.init();

    this.isGamePaused = false;
    this.timeToStart = 3;
    this.score = 0;

    this.currentBestScore = this.bestScore;
    this.countDownMessage = null;

    this.obstacles = new Pipes(this);
    this.player = new Bird(this);

    this.gameStateControls = new GameStateControls(this);

    this.menu = [
      { scene: undefined, title: "Resume" },
      { scene: undefined, title: "Exit" },
    ];
  }

  public create(): void {
    /*BACKGROUND */
    super.create();

    /*MAIN SOUND THEME */
    this.sound.play("audio", { volume: 0.1, loop: true });

    /*GAME OBJECTS */
    this.bird = this.player.createBird();

    this.pipesGroup = this.obstacles.createPipesGroup();

    /*HANDLE COLLIDES */
    this.collideHandler();

    /*SCORE */
    this.createMessage(16, 16, `Score: ${this.score}`);

    /*PAUSE BUTTON */
    this.createPauseButton();

    /** KEYS BINDINGS */
    this.gameStateControls.setUserEvents();
  }

  public update(time: number, dt: number): void {
    this.obstacles.cyclePipesCreate();
    this.obstacles.destroyPipe();

    this.player.checkBirdPosition();

    this.changeCoundownHandler();
  }

  private collideHandler(): void {
    this.physics.add.collider(
      this.bird,
      this.pipesGroup,
      this.gameStateControls.gameOver
    );
  }

  private createPauseButton(): void {
    this.pauseButton = this.add
      .image(this.canvasW - 10, this.canvasH - 10, "pause-btn")
      .setScale(3)
      .setInteractive()
      .setDepth(1)
      .setOrigin(1);
  }

  public onPressPauseButton = (): void => {
    if (!this.isGamePaused) {
      this.gameStateControls.pauseGame();
      this.isGamePaused = !this.isGamePaused;
    } else {
      this.showPauseMenu(false);
    }
  };

  public createMessage(
    x: number,
    y: number,
    text: string,
    styleConfig = { fontSize: "32px", color: "#000" }
  ): Phaser.GameObjects.Text {
    return (this.scoreMessage = this.add
      .text(x, y, text, styleConfig)
      .setDepth(2));
  }

  public saveBestScore(): void {
    this.currentBestScore = Math.max(this.score, this.bestScore);
    localStorage.setItem("bestScore", `${this.currentBestScore}`);
  }

  public showPauseMenu(showMenu: boolean): void {
    this.menu?.forEach((menuItem: IMenuItem) => {
      menuItem.textObject?.setVisible(showMenu);
    });

    !showMenu ? this.createCountDownMessage() : null;
  }

  public setMenuEvents = (menuItem: IMenuItem): void => {
    let textObj = menuItem.textObject;
    textObj?.setInteractive();

    if (menuItem.title === "Resume") {
      textObj?.on("pointerup", this.onPressPauseButton);
    }
    if (menuItem.title === "Exit") {
      textObj?.on("pointerup", () => {
        this.scene.stop("Game");
        this.scene.start("Menu");
      });
    }
  };

  private createCountDownMessage(): void {
    if (!this.countDownMessage) {
      this.countDownMessage = this.createMessage(
        ...this.center,
        `Fly in ${this.timeToStart}`,
        { fontSize: this.fontSize, color: this.fontColor }
      ).setOrigin(0.5, 1);
    }
  }
  private changeCoundownHandler(): void {
    if (!this.isGamePaused || this.timer) return;

    if (this.countDownMessage && !this.timer) {
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.timeToStart === 0 && this.isGamePaused) {
            this.timer?.remove();
            this.timer = null;

            this.countDownMessage?.destroy();
            this.countDownMessage = null;

            this.timeToStart = 3;

            this.gameStateControls.resumeGame();
          } else {
            this.countDownMessage?.setText(`Fly in ${this.timeToStart}`);
            this.timeToStart--;
          }
        },
        repeat: this.timeToStart,
      });
    }
  }
}
