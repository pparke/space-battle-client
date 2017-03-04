import Entity from './entity';

export default class Projectile extends Entity {

  constructor(sprite) {
    super();
    this.sprite = sprite;
  }

  update(timeMod){
    this.position.y += this.speed* -Math.sin(Math.PI/2) * timeMod;
  }

}
