import { Base, IMenuItem } from "../Base";

import { PipesGroup, Bird } from "../../models";
import { GameFlowControls } from "../../controls/GameFlowControls";

type Text = Phaser.GameObjects.Text;

export class Game extends Base {
  public isGamePaused!: boolean;
  public isGameOver!: boolean;

  public pipesGroup!: PipesGroup;
  public bird!: Bird;

  public score!: number;
  public scoreMessage!: Text;
  public currentBestScore!: number;

  pauseButton!: Phaser.GameObjects.Image;

  menu!: IMenuItem[];
  private countMessage!: Text | null;
  private counter!: number;
  public gameFlowControls!: GameFlowControls;

  constructor() {
    super("Game");
  }

  public init(): void {
    super.init();

    this.isGamePaused = false;
    this.isGameOver = false;
    this.counter = 3;
    this.score = 0;

    this.currentBestScore = this.bestScore;

    this.gameFlowControls = new GameFlowControls(this);

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
    this.bird = new Bird(this, this.canvasW * 0.1, this.center[1], "bird");

    this.pipesGroup = new PipesGroup(this);

    /*HANDLE COLLIDES */
    this.bird.addCollider(this.pipesGroup, this.gameFlowControls.gameOver);

    /*SCORE */
    this.scoreMessage = this.createMessage(16, 16, `Score: ${this.score}`);

    /*PAUSE BUTTON */
    this.createPauseButton();

    /** KEYS BINDINGS */
    this.setUserEvents();
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

  private setUserEvents = (): void => {
    const addKeyOnDown = (key: string, cb: () => void) =>
      this.input.keyboard.addKey(key).on("down", cb);

    addKeyOnDown("SPACE", this.bird.flap);
    addKeyOnDown("ESC", this.onPressPauseButton);

    this.pauseButton.on("pointerdown", this.onPressPauseButton);
  };

  public onPressPauseButton = (): void => {
    if (!this.isGamePaused) {
      this.gameFlowControls.pauseGame();
      this.isGamePaused = !this.isGamePaused;
    } else {
      this.showPauseMenu(false);
    }
  };

  private createMessage = (
    x: number,
    y: number,
    text: string,
    styleConfig = this.fontConfig
  ): Text => this.add.text(x, y, text, styleConfig).setDepth(2);

  public saveBestScore(): void {
    this.currentBestScore = Math.max(this.score, this.bestScore);
    localStorage.setItem("bestScore", `${this.currentBestScore}`);
  }

  private showPauseMenu(showMenu: boolean): void {
    this.menu?.forEach((menuItem: IMenuItem) => {
      menuItem.textObject?.setVisible(showMenu);
    });

    !showMenu && !this.countMessage?.alpha && this.createCountDownMessage();
  }

  private setMenuEvents = (menuItem: IMenuItem): void => {
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
    if (!this.countMessage) {
      this.countMessage = this.createMessage(
        ...this.center,
        `Fly in ${this.counter}`
      ).setOrigin(0.5, 1);
    }
    this.changeCoundownHandler();
  }

  private changeCoundownHandler(): void {
    let timer: Phaser.Time.TimerEvent;
    const countMessage = this.countMessage!;
    let counter = this.counter;

    countMessage.setAlpha(1);

    const timerConfig = {
      delay: 1000,
      callback: () => {
        if (!counter) {
          timer.remove();
          timer.destroy();

          countMessage.setAlpha(0);
          countMessage.setText(`Fly in ${(counter = 3)}`);

          this.gameFlowControls.resumeGame();
        } else {
          countMessage.setText(`Fly in ${counter--}`);
        }
      },
      repeat: 3,
    };

    timer = this.time.addEvent(timerConfig);
  }
}
