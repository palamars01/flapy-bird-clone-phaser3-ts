import { Game } from "../scenes/Game";

export class GameStateControls {
  constructor(private scene: Game) {}

  public pauseGame(): void {
    const scene = this.scene;

    scene.bgRect?.setVisible(true);
    scene.pauseButton.setAlpha(0.5);
    scene.sound.pauseAll();

    scene.bird.setVelocityY(0);
    scene.bird.anims.pause();
    scene.sound.play("flap", { volume: 0 });
    scene.physics.pause();

    if (scene.menu[0].textObject) {
      scene.showPauseMenu(true);
    } else {
      scene.drawMenu(scene.menu, scene.setMenuEvents);
    }
  }

  public resumeGame(): void {
    const scene = this.scene;

    scene.physics.resume();
    scene.sound.resumeAll();
    scene.bird.anims.resume();
    scene.bgRect?.setVisible(false);
    scene.isGamePaused = !scene.isGamePaused;
    scene.pauseButton.setAlpha(1);
  }

  public gameOver = (): void => {
    const scene = this.scene;

    scene.bird.anims.stop();
    scene.bird.setTint(0xff0000);

    scene.input.keyboard.removeAllKeys();

    scene.pauseButton.removeAllListeners();

    scene.sound.stopByKey("audio");
    scene.sound.play("collide", { volume: 0.3 });

    scene.physics.pause();

    scene.createMessage(16, 45, `Best score: ${scene.currentBestScore}`);

    scene.time.addEvent({
      delay: 1500,
      callback: () => scene.scene.restart(),
    });
  };

  public setUserEvents = (): void => {
    const scene = this.scene;

    const addKeyOnDown = (key: string, cb: () => void) =>
      scene.input.keyboard.addKey(key).on("down", cb);

    addKeyOnDown("SPACE", scene.bird.flap);
    addKeyOnDown("ESC", scene.onPressPauseButton);

    scene.pauseButton.on("pointerdown", this.scene.onPressPauseButton);
  };
}
