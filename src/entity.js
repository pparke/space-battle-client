export default class Entity {

  constructor(imgSource) {
    this.sprite = new Image();
    this.sprite.src = imgSource;
    this.size = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.speed = 250;
  }

  update(timeMod) {

  }

  render(context) {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    context.fillStyle = "black";
    context.fill();
  }

}
