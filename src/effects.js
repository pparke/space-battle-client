export const flash = {
  count: 100,
  lastCall: new Date().getTime(),
  interval: 100,
  duration: 50,
  done: false,
  run(context, entity) {
    if (this.count-- <= 0) {
      this.done = true;
    }
    const now = new Date().getTime();
    if (now - this.lastCall > this.interval) {
      if (now - this.lastCall > this.interval + this.duration) {
        this.lastCall = now;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = entity.size.x;
      canvas.height = entity.size.y;
      ctx.drawImage(entity.sprite, 0, 0, entity.size.x, entity.size.y);
      const entData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < entData.data.length; i += 4) {
        if(entData.data[i + 3] > 0) {
          entData.data[i] += 200;
        }
      }
      ctx.putImageData(entData, 0, 0);
      context.drawImage(canvas, entity.position.x, entity.position.y, entity.size.x, entity.size.y);
    }
  }
}
