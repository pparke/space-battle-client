import Entity from './entity';

export default class Boss extends Entity {

  constructor() {
    super(...arguments);

    this.minHeight = 0.2;
    this.lastPos = 0;

    this.updateImgSrc = this.updateImgSrc.bind(this);
  }

  updateImgSrc(base64String) {
    this.sprite.src = 'data:image/png;base64,' + base64String;
  }

  updatePos(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  fireLaser() {

  }
}
