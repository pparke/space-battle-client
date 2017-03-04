export function flash() {
  let count = 10;
  let lastCall = new Date().getTime();
  const timing = 50;

  return {
    count: 10,
    lastCall: new Date().getTime(),
    run() {
      if (this.count-- <= 0) {

      }
    }
    this.context.beginPath();
    this.context.rect(0, 0, this.size.width, this.size.height);
    this.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
    this.context.fill();
  }
}
