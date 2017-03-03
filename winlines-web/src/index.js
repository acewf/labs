require("babel-register");
import * as PIXI from 'pixi.js';
import Stage from './stage';

export default new function initialise() {
    console.log(PIXI);
    const stage = new Stage();
}


/*
/// Async import
import('starter').then(function(starter) {
  //
  console.log(starter);
  new starter.default('pedro');
}).catch(function(err) {
  console.log('Failed to load moment', err);
});
*/
