import Boss from './boss';
import Player from './player';
import io from 'socket.io-client';
import Keyboard from './keyboard';
import * as effects from './effects';
import Projectile from './projectile'

class SpaceBattles {

  /**
   * Game Setup
   */
  constructor() {

    // Listen for frame data from the server and handle it.
    const socket = io('http://localhost:3090');

    this.handleSocketData = this.handleSocketData.bind(this);
    this.convertToB64 = this.convertToB64.bind(this);
    this.animate = this.animate.bind(this);
    this.loop = this.loop.bind(this);
    this.setupSocketListener = this.setupSocketListener.bind(this);

    // Grab canvas element from the dom to render to.
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');

    // Set initial last frame timee
    this.lastFrameTime = Date.now();

    // Load background
    this.background = new Image();
    this.background.src = 'assets/background/background.png';
    this.background.onload = () => { this.background.hasLoaded = true; }
    this.background.offset = 0;
    this.background.direction = 1;

    // Load project tile
    this.projectileImage = new Image();
    this.projectileImage.src = 'assets/ship/simple_shot2.png';
    this.projectileImage.onload = () => { this.projectileImage.hasLoaded = true; }

    // Setup entities
    this.entities = [];

    // Setup projectiles
    this.projectiles = [];

    this.bossProjectiles = [];

    const player = new Player('../assets/ship/ship2.png');
    player.health = 100;
    player.size = { x: 84, y: 84 };
    player.position = { x: (this.canvas.width / 2) - (player.size.x / 2), y: this.canvas.height - 84 }

    const boss = new Boss();
    boss.health = 100;
    boss.size = { x: 128, y: 128 };
    boss.position = { x: this.canvas.width / 2, y: 42 };
    boss.angry = false;
    boss.addDecoration('../assets/boss/boss.png', { x: -25, y: -25 }, { x: this.boss.size.x+50, y: this.boss.size.y+50 });
    this.boss = boss;

    this.entities.push(player);
    this.entities.push(boss);

    this.player = player;

    // Load game sounds
    this.sounds = {
      music: new Audio('assets/music.mp3'),
      fire: new Audio('assets/fire.mp3')
    };

    // Play background music
    this.sounds.music.play();

    // Start the game loop.
    this.animate();
    this.setupSocketListener(socket);

    this.pressed = false;
    this.shotCount = 0;
    this.bossShotCount = 0;

    this.BossLastFramePos = boss.position.y;
    this.BossCurrentFramePos = boss.position.y;
}

  setupSocketListener(socket) {
    /**
     * data = {
     * buffer: Buffer
     * position: { x, y }
     * size: { width, height }
     * }
     */
    socket.on('frame', this.handleSocketData);
  }

  handleSocketData(data) {
    const b64 = this.convertToB64(data.buffer);
    this.boss.updateImgSrc(b64);
    const { width, height } = this.canvas;
    const xpos = width - (data.position.x * width);
    const ypos = data.position.y > this.boss.minHeight ? this.boss.minHeight * height : data.position.y * height;
    this.boss.updatePos(xpos, ypos);
  }

  convertToB64(buf) {
    const uint8Arr = new Uint8ClampedArray(buf);
    const str = String.fromCharCode.apply(null, uint8Arr);
    return btoa(str);
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
    this.BossCurrentFramePos = this.boss.position.y;

    this.background.offset += timeMod * this.background.direction;

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

      // Keep player below half height
      if(this.player.position.y < this.canvas.height / 2) {
        this.player.position.y = this.canvas.height / 2;
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
      if(Keyboard.keyPressed(Keyboard.KEY.SPACE) && !this.pressed){
        this.shotCount++;
        this.pressed = true;
        const projectile = new Projectile(this.projectileImage);
        projectile.size = { x: 24, y: 32 };
        projectile.position = {
          x: (this.player.position.x + this.player.size.x / 2) - projectile.size.x / 2,
          y: this.player.position.y - 12
        }
        this.projectiles.push(projectile);
        this.sounds.fire.play();
      }
    });

    if(!Keyboard.keyPressed(Keyboard.KEY.SPACE) && this.pressed){
        this.pressed = false;
    }

    this.entities.map(entity => entity.update(timeMod));
    this.projectiles.map(projectile => projectile.update(timeMod));


    for(let i = 0; i < this.projectiles.length; i++){
      if(this.projectiles[i].position.y < 0){
        const index = this.projectiles[i];
        this.projectiles.splice(index, 1);
        console.log("played bullet CLEARED");
        this.shotCount--;
      }
      else if (this.isColliding(this.boss, this.projectiles[i])){
        this.projectiles.splice(i, 1);
        this.boss.health -= 5;
        this.shotCount--;
        console.log("Boss Hit");
      }
     }

     if(this.boss.health == 0){
       this.projectiles = [];
       alert("The Boss Is Dead")
      window.location.reload();
     }


     //boss is lasering
     if(this.BossLastFramePos - this.BossCurrentFramePos > 10){

     }
    //boss
    //  if(){
    //  }

    for(let i = 0; i < this.bossProjectiles.length; i++){
      if(this.bossProjectiles[i].position.y < 0){
        const index = this.bossProjectiles[i];
        this.bossProjectiles.splice(index, 1);
        this.bossShotCount--;
        console.log("Boss bullet CLEARED");
      }
      else if (this.isColliding(this.player, this.bossProjectiles[i])){
        this.bossProjectiles.splice(i, 1);
        this.player.health -= 5;
        this.bossShotCount--;
        console.log("Player Hit");
      }
    }

    if(this.player.health == 0){
      if (confirm("The Player Has Died")){
        window.location.reload();
       }
    }
    this.BossLastFramePos = this.boss.position.y;

    // Handle low boss health
    if(this.boss.health < 40 && !this.boss.angry) {
      this.boss.decorations = [];
      this.boss.angry = true;
      this.boss.addDecoration('../assets/boss/boss_damaged.png', { x: -25, y: -25 }, { x: boss.size.x+50, y: boss.size.y+50 });
    }
}

isColliding(entityHit, projectile){
  if  (projectile.position.y >= entityHit.position.y
       && projectile.position.y <= entityHit.position.y + entityHit.size.y
       && projectile.position.x >= entityHit.position.x
       && projectile.position.x <= entityHit.position.x + entityHit.size.x ){

              return true;
            }
            else{
              return false
            }
}


  /**
   * Render
   */
  render() {

    // Render Background
    if(this.background.hasLoaded) {
      this.context.drawImage(
        this.background,
        0,
        this.background.offset * 10, // This needs to grow
        this.background.width,
        this.canvas.height,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // When we run out of background to scroll, we need to restart
    if(
      ((this.background.offset * 10) + this.canvas.height > this.background.height) ||
      this.background.offset < 0
    ) {
      this.background.direction = -(this.background.direction);
    }

    // Render Entities
    this.entities.map(entity => entity.render(this.context));

    // Render Projecties
    this.projectiles.map(projectile => projectile.render(this.context));

    // Render player health bar
    this.context.beginPath();
    this.context.rect(
      this.canvas.width - 36,
      this.canvas.height - this.player.health - 12,
      24,
      this.player.health
    );
    this.context.fillStyle = (this.player.health > 50) ? "green" : (this.player.health > 25) ? "yellow" : "red";
    this.context.fill();

    // Render boss health bar
    this.context.beginPath();
    this.context.rect(
      this.canvas.width - 36,
      12,
      24,
      this.boss.health
    );
    this.context.fillStyle = (this.boss.health > 50) ? "green" : (this.boss.health > 25) ? "yellow" : "red";
    this.context.fill();

  }

}

const game = new SpaceBattles();
