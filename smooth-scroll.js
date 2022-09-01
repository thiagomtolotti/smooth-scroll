class SmoothScroll {
  constructor(target, speed, smooth){
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

  set target(newTarget){
    if(newTarget === document){
      newTarget = (document.scrollingElement
                    || document.documentElement
                    || document.body.parentNode
                    || document.body); //cross browser support
    }

    this._target = newTarget
  }
  get target(){
    return this._target
  }

  set moving(status){
    this._moving = status
  }
  get moving(){
    return this._moving;
  }

  render(){
    this.target.addEventListener("mousewheel", e => this.scrolled(e), {passive: false })
    this.target.addEventListener("DOMMouseScroll", e => this.scrolled(e), {passive: false })
  }

  scrolled(e){
    e.preventDefault();

    if(this.target.style.overflowY == "hidden" || this.target.style.overflow == "hidden") return;

    let delta = this.normalizeWheelDelta(e); //definir a função do delta

    this.pos += delta * this.speed
    this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight))

    if(!this.moving) this.update(); //se está movimentando atualiza a página
  }

  normalizeWheelDelta(e){
    if(e.detail){ //detail é os dados passados ao evento quando inicializado
      if(e.wheelDelta){
        return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1);
      }else{
        return -e.detail/3 //Firefox
      }
    }else{
      return -e.wheelDelta/120 //IE, Safari, Chrome
    }
  }

  update(){
    this.moving = true;

    let delta = (this.pos - this.target.scrollTop)/this.smooth;

    this.target.scrollTop += delta

    if(Math.abs(delta) > 0.5){
      // this.requestFrame(this.update)
      //Da segunda vez que faz o loop ele perde a referência do 'this'
    }else{
      this.moving = false
    }
  }

  requestFrame = function(func){
    window.requestAnimationFrame(func())
  }
}

//https://developer.mozilla.org/pt-BR/docs/Web/API/Window/requestAnimationFrame

new SmoothScroll(document, 150, 12);
