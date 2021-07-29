import { Base, IMenuItem } from "../Base";

import { PipesGroup, Bird } from "../../models";
import { GameStateControls } from "../../controls/GameStateControls";

type Text = Phaser.GameObjects.Text;

export class Game extends Base {
  public isGamePaused!: boolean;
  public isGameOver!: boolean;

  public pipesGroup!: PipesGroup;
  public bird!: Bird;

  score!: number;
  scoreMessage!: Text;
  currentBestScore!: number;

  pauseButton!: Phaser.GameObjects.Image;

  menu!: IMenuItem[];
  private countDownMessage!: Text | undefined;
  private timeToStart!: number;
  private timer!: Phaser.Time.TimerEvent | null;
  public gameStateControls!: GameStateControls;

  constructor() {
    super("Game");
  }

  public init(): void {
    super.init();

    this.isGamePaused = false;
    this.isGameOver = false;
    this.timeToStart = 3;
    this.score = 0;

    this.currentBestScore = this.bestScore;

    this.gameStateControls = new GameStateControls(this);

    this.menu = [
      { scene: undefined, title: "Resume" },
      { scene: undefined, title: "Exit" },
    ];
  }

  public create(): void {
    const { setUserEvents, gameOver } = this.gameStateControls;
    /*BACKGROUND */
    super.create();

    /*MAIN SOUND THEME */
    this.sound.play("audio", { volume: 0.1, loop: true });

    /*GAME OBJECTS */
    this.bird = new Bird(this, this.canvasW * 0.1, this.center[1], "bird");

    this.pipesGroup = new PipesGroup(this);

    /*HANDLE COLLIDES */
    this.bird.addCollider(this.pipesGroup, gameOver);

    /*SCORE */
    this.scoreMessage = this.createMessage(16, 16, `Score: ${this.score}`);

    /*PAUSE BUTTON */
    this.createPauseButton();

    /** KEYS BINDINGS */
    setUserEvents();
  }

  public update(time: number, dt: number): void {
    this.pipesGroup.cyclePipesCreate();
    this.pipesGroup.destroyPipe();

    this.bird.checkBirdPosition();
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

  public createMessage = (
    x: number,
    y: number,
    text: string,
    styleConfig = this.fontConfig
  ): Text => this.add.text(x, y, text, styleConfig).setDepth(2);

  public saveBestScore(): void {
    this.currentBestScore = Math.max(this.score, this.bestScore);
    localStorage.setItem("bestScore", `${this.currentBestScore}`);
  }

  public showPauseMenu(showMenu: boolean): void {
    this.menu?.forEach((menuItem: IMenuItem) => {
      menuItem.textObject?.setVisible(showMenu);
    });

    !showMenu && !this.countDownMessage ? this.createCountDownMessage() : null;
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
    this.countDownMessage = this.createMessage(
      ...this.center,
      `Fly in ${this.timeToStart}`
    ).setOrigin(0.5, 1);
    this.changeCoundownHandler();
  }

  private changeCoundownHandler(): void {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.timeToStart === 0 && this.isGamePaused) {
          this.timeToStart = 3;

          this.timer?.remove();
          this.timer = null;

          this.countDownMessage?.destroy();
          this.countDownMessage = undefined;

          this.gameStateControls.resumeGame();
        } else {
          this.countDownMessage?.setText(`Fly in ${this.timeToStart--}`);
        }
      },
      repeat: 3,
    });
  }
}
