export default class Interface {
  constructor() {
    this.uiConsole = new UIConsole();
    this.uiWatch = new UIWatch();

    this.uiConsole.render();
    this.uiWatch.render();
  }

  log(message) {
    this.uiConsole.log(message);
  }

  watch(/**/) {
    this.uiWatch.watch(...arguments);
  }
}

class UIElement {
  constructor(top, left, bottom, right, width, height, color) {
    this.element = document.createElement('DIV');
    this.element.style.width = width;
    this.element.style.height = height;
    this.element.style.backgroundColor = color;
    this.element.style.boxSizing = 'border-box';
    this.element.style.position ='fixed';
    this.element.style.top = top;
    this.element.style.left = left;
    this.element.style.bottom = bottom;
    this.element.style.right = right;
    this.element.style.color = 'white';
  }

  render () {
    document.body.appendChild(this.element);
  }
}

class UIConsole extends UIElement {
  constructor() {
    super('0', '0', 'initial', 'initial', '100vw', 'auto', 'rgba(255, 255, 255, 0.5)');
    this.element.style.padding = '10px';
    this.messages = [];
  }

  log(message) {
    this.messages.push(message);
    this.update();
  }

  clear() {
    this.messages = [];
    this.update();
  }

  update() {
    var str = '';
    for (var i = 0; i < this.messages.length; i++) {
      str += '<p>' + this.messages[i] + '</p>';
    }
    this.element.innerHTML = str;
  }
}

class UIWatch extends UIElement {
  constructor () {
    super('initial', 'initial', '0', '0', '300px', 'auto', 'black');
    this.element.style.padding = '5px';
    this.watched = [];
  }

  watch(/**/) {
    var args = arguments;
    for (var i = 0; i < args.length; i++) {
      this.watched.push(args[i][0] + ': ' + args[i][1]);
    }
    this.update();
  }

  update() {
    var str = '';
    for (var i = 0; i < this.watched.length; i++) {
      str += '<p>' + this.watched[i] + '</p>';
    }
    this.element.innerHTML = str;
    this.watched = [];
  }
}