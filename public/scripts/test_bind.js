// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind

this.x = 9;
var module = {
  x: 81,
  getX: function() {
    return this.x;
  }
};

console.log('-start-');
console.log(module.x);
console.log(module.getX());
console.log('-end-');

// Pass func
var new_x_func = module.getX;

// New context, why it is undefined?
console.log(new_x_func());

var bind_new_x_func = new_x_func.bind(module);
console.log(bind_new_x_func());


