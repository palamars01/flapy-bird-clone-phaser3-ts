import Phaser from "phaser";

export default function (min: number, max: number): number {
  return Phaser.Math.Between(min, max);
}
