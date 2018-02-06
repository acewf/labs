import 'index.css'
import Stats from 'stats-js';


export default class Root {
  constructor(props) {
    const canvas = document.createElement("canvas");
    this.canvas = canvas;

    requestAnimationFrame(this.animate);
  }

  addStats = () => {
    this.stats = new Stats();
    document.body.appendChild(this.canvas);
    document.body.appendChild(this.stats.domElement);
  }

  onresize = () => {
    console.log('onResize');
  }

  animate = () => {
    if (this.stats)
      this.stats.begin();
    this.stats.end();
    requestAnimationFrame(this.animate);
  }
}

new Root();