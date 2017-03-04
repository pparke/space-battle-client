import io from 'socket.io-client';

class SpaceBattles {

  /**
   * Game Setup
   */
  constructor() {

    // Setup socket to stream image data from server.
    const socket = io('http://localhost:3090');

    // Create web worker for reading data from server.
    const worker = new Worker('./worker.js');

    // When worker gives us new data, set it on game object.
    worker.addEventListener('message', (e) => {
      // TODO: have the worker do the parsing of the data
      //       but we should be storing the data here so it
      //       is accesible in update/render
      console.log('GOT DATA FROM WORKER: ', e.data);
    }, false);

    // Grab canvas element from the dom to render to.
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');

    // Set initial last frame time
    this.lastFrameTime = Date.now();

    // Start the game loop.
    this.animate();

  }

  /**
   * Animate
   */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.look();
  }

  /**
   * Game Loop
   */
  loop() {
    let now = Date.now();
    let timeMod = (now - this.lastFrameTime) / 1000;
    this.update(timeMod);
    this.render();
    this.lastFrameTime = now;
  }

  /**
   * Update
   */
  update() {

  }

  /**
   * Render
   */
  render() {

  }

}

const game = new SpaceBattles();


const socket = io('http://localhost:3090');

const canvas = document.getElementById('canvas-video');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
const img = new Image();

// show loading notice
ctx.fillStyle = '#333';
ctx.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

socket.on('frame', (data) => {
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
/*
  const buf = new ArrayBuffer(width * height * 4);
  const imgArr = new Uint8ClampedArray(buf);
  const imgData = new ImageData(imgArr, width, height);
  ctx.putImageData(imgData, 0, 0);
*/
  const uint8Arr = new Uint8ClampedArray(data.buffer);
  const str = String.fromCharCode.apply(null, uint8Arr);
  const base64String = btoa(str);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
});
