import Entity from './entity';

export default class Boss extends Entity {

  constructor() {
    super(...arguments);
    this.drawReady = false;
    this.drawDone = true;
    this.img = new Image();
    this.img.onload = () => { this.drawReady = true };
    this.size = { width: 0, height: 0 };
    this.position = { x: 0, y: 0 };

    this.updateImgSrc = this.updateImgSrc.bind(this);
    this.render = this.render.bind(this);
  }

  updateImgSrc(base64String) {
    if (!this.drawDone) {
      return;
    }
    this.drawReady = false;
    this.drawDone = false;
    this.img.src = 'data:image/png;base64,' + base64String;
  }

  render(context) {
    super.render(context);
    if (!this.drawReady) {
      return;
    }
    console.log('rendering boss')
    context.drawImage(this.img,
                       0,
                       0,
                       this.size.width,
                       this.size.height,
                       this.position.x,
                       this.position.y,
                       this.size.width,
                       this.size.height
                      );
    this.drawDone = true;
  }

}
