require("babel-register");
import * as PIXI from 'pixi.js';
import Application from './components/Application';
import DefaultView from './components/DefaultView';

export default new function initialise() {
  const view = new DefaultView();
  const app = new Application(view);
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
