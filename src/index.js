import io from 'socket.io-client';
import InlineWorker from 'inline-worker';
import Player from './player';
import Boss from './boss';
import Keyboard from './keyboard';
import Projectile from './projectile'

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

    // Set initial last frame timee
    this.lastFrameTime = Date.now();

    // Setup entities
    this.entities = [];

    // Setup projectiles
    this.projectiles = [];

    const player = new Player();
    player.size = { x: 32, y: 32 };
    player.position = { x: this.canvas.width / 2, y: this.canvas.height - 48 }

    const boss = new Boss();
    boss.size = { x: 128, y: 128 };
    boss.position = { x: this.canvas.width / 2, y: 42 }

    this.entities.push(player);
    this.entities.push(boss);

    this.player = player;

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

    this.entities.forEach((e) => {

      // Check for and resolve entity edge collions on X axis
      if(e.position.x < 0) {
        e.position.x = 0;
      }
      else if(e.position.x + e.size.x > this.canvas.width) {
        e.position.x = this.canvas.width - e.size.x;
      }

      // Check for and resolve entity edge colliions on Y axis
      if(e.position.y < 0) {
        e.position.y = 0;
      }
      else if (e.position.y + e.size.y > this.canvas.height) {
        e.position.y = this.canvas.height - e.size.y;
      }

      // Check for and resolve player on entity collisons
      if(
        !(e instanceof Player) &&
        !(
          this.player.position.y + this.player.size.y < e.position.y ||
          this.player.position.y > e.position.y + e.size.y ||
          this.player.position.x + this.player.size.x < e.position.x ||
          this.player.position.x > e.position.x + e.size.x
        )
      ){
        this.player.revertMove(timeMod);
      }

      // Fire projectile if player is shooting.
      if(Keyboard.keyPressed(Keyboard.KEY.DOWN)){
        const projectile = new Projectile();
        projectile.position = {
          x: this.player.position.x + (this.player.size.x / 2),
          y: this.player.position.y - 12
        }
        projectile.size = { x: 4, y: 12 };
        this.projectiles.push(projectile);
      }

    });

    this.entities.map(entity => entity.update(timeMod));
    this.projectiles.map(projectile => projectile.update(timeMod));
    
    for(let i = 0; i < this.projectiles.size; i++){
      if(this.projectiles[i].position.y > this.canvas.length){
        this.projectiles.remove(this.projectiles.indexof(pProjectile));
      }
    }
    console.log(this.projectiles.length);
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
    this.projectiles.map(projectile => projectile.render(this.context));
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
