import io from 'socket.io-client';
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

function setup() {
  let video = document.getElementById('video');
  let canvas = document.getElementById('canvas-video');
  let startbutton = document.getElementById('startbutton');
}
