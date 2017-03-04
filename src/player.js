import Entity from './entity';
import Keyboard from './keyboard';

export default class Player extends Entity {

  constructor() {
    super(...arguments);
  }

  update(timeMod) {
    super.update(...arguments);

    // UP - RIGHT
    if(Keyboard.keyPressed(Keyboard.KEY.UP) && Keyboard.keyPressed(Keyboard.KEY.RIGHT)){
      this.move(Math.PI/4, timeMod);
    }

    // DOWN - RIGHT
    else if(Keyboard.keyPressed(Keyboard.KEY.RIGHT) && Keyboard.keyPressed(Keyboard.KEY.DOWN)){
      this.move(7*Math.PI/4, timeMod);
    }

    // DOWN - LEFT
    else if(Keyboard.keyPressed(Keyboard.KEY.DOWN) && Keyboard.keyPressed(Keyboard.KEY.LEFT)){
      this.move(5*Math.PI/4, timeMod);
    }

    // UP - LEFT
    else if(Keyboard.keyPressed(Keyboard.KEY.LEFT) && Keyboard.keyPressed(Keyboard.KEY.UP)){
      this.move(3*Math.PI/4, timeMod);
    }

    // Check for single key pressed

    // UP
    else if(Keyboard.keyPressed(Keyboard.KEY.UP)){
      this.move(Math.PI/2, timeMod);
    }

    // RIGHT
    else if(Keyboard.keyPressed(Keyboard.KEY.RIGHT)){
      this.move(0, timeMod);
    }

    // DOWN
    else if(Keyboard.keyPressed(Keyboard.KEY.DOWN)){
      this.move(3*Math.PI/2, timeMod);
    }

    // LEFT
    else if(Keyboard.keyPressed(Keyboard.KEY.LEFT)){
      this.move(Math.PI, timeMod);
    }

  }

  move(direction, timeMod) {
    this.position.x += this.speed * Math.cos(direction) * timeMod;
    this.position.y += this.speed * -Math.sin(direction) * timeMod;
    this.lastMoveDirection = direction;
  }

  revertMove(timeMod) {
    this.position.x -= this.speed * Math.cos(this.lastMoveDirection) * timeMod;
    this.position.y -= this.speed * -Math.sin(this.lastMoveDirection) * timeMod;
  }

}
