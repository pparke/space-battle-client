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

    this.decorations = [];

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  addDecoration(src, pos, size) {
    const dec = {};
    dec.img = new Image();
    dec.img.onload = () => {
      dec.ready = true;
    }
    dec.img.src = src;
    dec.pos = pos;
    dec.size = size;
    dec.ready = false;
    this.decorations.push(dec);
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
      for (const dec of this.decorations) {
        if (!dec.ready) {
          continue;
        }
        context.drawImage(
          dec.img,
          this.position.x + dec.pos.x,
          this.position.y + dec.pos.y,
          dec.size.x,
          dec.size.y
        );
      }
    }
    else {
      context.beginPath();
      context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
      context.fillStyle = "white";
      context.fill();
    }
  }

}
