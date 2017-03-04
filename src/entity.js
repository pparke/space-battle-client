export default class Entity {

  constructor(imgSource) {
    this.sprite = new Image();

    this.sprite.src = imgSource || '';
    this.sprite.onload = () => {
      this.sprite.hasLoaded = true;
    };

    this.size = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.speed = 250;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  update(timeMod) {

  }

  render(context) {
    if(this.sprite.hasLoaded) {
      context.drawImage(
        this.sprite,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    }
    else {
      context.beginPath();
      context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
      context.fillStyle = "black";
      context.fill();
    }
  }

}
