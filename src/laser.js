import Entity from './entity';

export default class Laser extends Entity {

  constructor(imgSource) {
    super(...arguments);
    this.entity;
    this.maxLength = 1000;
    this.dead = true;
  }

  reset(entity) {
    this.dead = false;
    this.size.y = 0;
    this.size.x = 50;
    this.entity = entity;
  }

  update(timeMod){
    if (this.dead) {
      return;
    }
    this.position.y = this.entity.position.y + this.entity.size.y - 30;
    this.position.x = this.entity.position.x + this.entity.size.x/2 - this.size.x/2;
    if (this.size.y < this.maxLength) {
      this.size.y += 5;
    }
    else {
      console.log('killing laser')
      this.dead = true;
    }
  }

  render() {
    super.render(...arguments);
  }

}
