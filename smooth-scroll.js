// SmoothScroll.pause() -> Pausa ou retorna o movimento
// SmoothScroll.target = '' -> muda o elemento scrollável

class SmoothScroll {
  constructor(target, speed, smooth) {
    this.target = target
    this.speed = speed
    this.smooth = smooth

    this.moving = false;
    this.pos = this.target.scrollTop
    this.frame = document.body
      && document.documentElement
      ? document.documentElement
      : this.target //safari is the new IE

    this.render()
  }

  set target(newTarget) {
    if (newTarget === document) {
      newTarget = (document.scrollingElement
        || document.documentElement
        || document.body.parentNode
        || document.body); //cross browser support
    }

    this._target = newTarget
  }
  get target() {
    return this._target
  }
  set moving(status) {
    this._moving = status
  }
  get moving() {
    return this._moving;
  }
  get paused(){
    if(this._paused == undefined) return false
    return this._paused;
  }
  pause(){
    this._paused = !this._paused
  }

  render() {
    this.target.addEventListener("mousewheel", e => this.scrolled(e), { passive: false })
    this.target.addEventListener("DOMMouseScroll", e => this.scrolled(e), { passive: false })
  }

  scrolled(e) {
    if(this._paused) return

    e.preventDefault();

    //permite outros tipos de scroll
    this.pos = this.target.scrollTop

    if (this.target.style.overflowY == "hidden" || this.target.style.overflow == "hidden") return;

    let delta = this.normalizeWheelDelta(e);
    this.pos += delta * this.speed
    this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight))

    if (!this.moving) this.update();
  }

  normalizeWheelDelta(e) {
    if (e.detail) { //detail é os dados passados ao evento quando inicializado
      if (e.wheelDelta) {
        return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1);
      } else {
        return -e.detail / 3 //Firefox
      }
    } else {
      return -e.wheelDelta / 120 //IE, Safari, Chrome
    }
  } 

  //Função responsável por alterar o 'scroll' na página de fato
  update() {
    this.moving = true;

    let delta = Math.round((this.pos - this.target.scrollTop) / this.smooth);

    this.target.scrollTop += delta

    if (Math.abs(delta) > .5) {
      this.requestFrame(this.update.bind(this))
    }else{
      this.moving = false
    }
  }

  requestFrame(func) {
    window.requestAnimationFrame(func) ||
      window.webkitRequestAnimationFrame(func) ||
      window.mozRequestAnimationFrame(func) ||
      window.oRequestAnimationFrame(func) ||
      window.msRequestAnimationFrame(func) ||
      function (func) {
        window.setTimeout(func, 1000 / 50);
      };
  }
}

let smoothScroll = new SmoothScroll(document, 120, 12);