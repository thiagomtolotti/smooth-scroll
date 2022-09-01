class SmoothScroll {
  constructor(target, speed, smooth){
    this.speed = speed
    this.smooth = smooth

    this.target = target

    if(this.target === document){
      this.target = (document.scrollingElement
                    || document.documentElement
                    || document.body.parentNode
                    || document.body); //cross browser support
    }
    this.moving = false;
    this.pos = this.target.scrollTop
    this.frame = document.body
      && document.documentElement
      ? document.documentElement
      : this.target //safari is the new IE

    this.render()
  }

  get target(){
    return this.target
  }

  set target(target){
    if(target === document){
      target = (document.scrollingElement
                    || document.documentElement
                    || document.body.parentNode
                    || document.body); //cross browser support
    }

    this.target = target
  }

  render(){
    this.target.addEventListener("mousewheel", this.scrolled, {passive: false })
    this.target.addEventListener("DOMMouseScroll", this.scrolled, {passive: false })
  }

  scrolled(e){
    e.preventDefault();

    console.log(this.target)

    if(this.target.style.overflowY == "hidden" || this.target.style.overflow == "hidden") return;

    this.delta = 0
  }
}

new SmoothScroll(document, 150, 12);
