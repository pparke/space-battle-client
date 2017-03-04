import io from 'socket.io-client';
import InlineWorker from 'inline-worker';
import Player from './player';
import Boss from './boss';
import Keyboard from './keyboard';

class SpaceBattles {

  /**
   * Game Setup
   */
  constructor() {

    // Listen for frame data from the server and handle it.
    const socket = io('http://localhost:3090');
    socket.on('frame', (data) => {
      console.log('got data from server: ', data);
    });

    // Grab canvas element from the dom to render to.
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');

    // Set initial last frame time
    this.lastFrameTime = Date.now();

    // Setup entities
    this.entities = [];

    const player = new Player();
    player.size = { x: 32, y: 32 };
    player.position = { x: this.canvas.width / 2, y: this.canvas.height - 48 }

    const boss = new Boss();
    boss.size = { x: 128, y: 128 };
    boss.position = { x: this.canvas.width / 2, y: 42 }

    this.entities.push(player);
    this.entities.push(boss);

    // Start the game loop.
    this.animate();

  }

  /**
   * Animate
   */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.loop();
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
  update(timeMod) {

    this.entities.forEach((entity) => {

      // Check for and resolve entity edge collions on X axis
      if(entity.position.x < 0) {
        console.log('COLLISION DETECHTION');
        entity.position.x = 0;
      }
      else if(entity.position.x + entity.size.x > this.canvas.width) {
        console.log('COLLISION DETECHTION');
        entity.position.x = this.canvas.width - entity.size.x;
      }

      // Check for and resolve entity edge colliions on Y axis
      if(entity.position.y < 0) {
        console.log('COLLISION DETECHTION');
        entity.position.y = 0;
      }
      else if (entity.position.y + entity.size.y > this.canvas.height) {
        entity.position.y = this.canvas.height - entity.size.y;
      }


    });

    this.entities.map(entity => entity.update(timeMod));
  }

  /**
   * Render
   */
  render() {
    this.context.beginPath();
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "blue";
    this.context.fill();
    this.entities.map(entity => entity.render(this.context));
  }

}

const game = new SpaceBattles();


/*
const socket = io('http://localhost:3090');

const canvas = document.getElementById('canvas-video');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
const img = new Image();

// show loading notice
ctx.fillStyle = '#333';
ctx.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

socket.on('frame', (data) => {
  // Reference: http://    const self = {};
    const worker = new InlineWorker(function(self){
      const socket = io('http://localhost:3090');
      socket.on('frame', (data) => {
        postMessage(data);
      });
    });stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
/*
  const buf = new ArrayBuffer(width * height * 4);
  const imgArr = new Uint8ClampedArray(buf);
  const imgData = new ImageData(imgArr, width, height);
  ctx.putImageData(imgData, 0, 0);
*/
/*
  const uint8Arr = new Uint8ClampedArray(data.buffer);
  const str = String.fromCharCode.apply(null, uint8Arr);
  const base64String = btoa(str);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
});
*/
