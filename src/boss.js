import Entity from './entity';

export default class Boss extends Entity {

  constructor() {
    super(...arguments);

    this.minHeight = 0.2;
    this.lastPos = {x: 0, y: 0};

    this.updateImgSrc = this.updateImgSrc.bind(this);
  }

  updateImgSrc(base64String) {
    this.sprite.src = 'data:image/png;base64,' + base64String;
  }

  updatePos(x, y) {
    if (x === 0 || y === 0) {
      return;
    }
    this.lastPos.y = this.position.y;
    this.lastPos.x = this.position.x;
    this.position.x = x;
    this.position.y = y;
  }

  fireLaser() {

  }
}
