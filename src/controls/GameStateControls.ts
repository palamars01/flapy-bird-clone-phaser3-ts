import { Game } from "../scenes/Game";

export class GameStateControls {
  scene: Game;
  constructor(scene: Game) {
    this.scene = scene;

    this.pauseGame = this.pauseGame;
    this.resumeGame = this.resumeGame;
    this.gameOver = this.gameOver;
  }

  public pauseGame(): void {
    this.scene.bgRect?.setVisible(true);
    this.scene.pauseButton.setAlpha(0.5);
    this.scene.sound.pauseAll();

    this.scene.bird.setVelocityY(0);
    this.scene.bird.anims.pause();
    this.scene.sound.play("flap", { volume: 0 });
    this.scene.physics.pause();

    if (this.scene.menu[0].textObject) {
      this.scene.showPauseMenu(true);
    } else {
      this.scene.drawMenu(this.scene.menu, this.scene.setMenuEvents);
    }
  }

  public resumeGame(): void {
    this.scene.physics.resume();

    this.scene.sound.resumeAll();

    this.scene.bird.anims.resume();

    this.scene.bgRect?.setVisible(false);

    this.scene.isGamePaused = !this.scene.isGamePaused;

    this.scene.pauseButton.setAlpha(1);
  }

  public gameOver = (): void => {
    this.scene.bird.anims.stop();
    this.scene.bird.setTint(0xff0000);

    this.scene.input.keyboard.removeAllKeys();

    this.scene.pauseButton.removeAllListeners();

    this.scene.sound.stopByKey("audio");
    this.scene.sound.play("collide", { volume: 0.3 });

    this.scene.physics.pause();

    this.scene.createMessage(
      16,
      45,
      `Best score: ${this.scene.currentBestScore}`
    );

    this.scene.time.addEvent({
      delay: 1500,
      callback: () => this.scene.scene.restart(),
    });
  };

  public setUserEvents(): void {
    this.scene.input.keyboard
      .addKey("SPACE")
      .on("down", this.scene.player.flap);

    this.scene.input.keyboard
      .addKey("ESC")
      .on("down", this.scene.onPressPauseButton);

    this.scene.pauseButton.on("pointerdown", this.scene.onPressPauseButton);
  }
}
