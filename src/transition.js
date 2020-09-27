class Transition extends HTMLElement {
  constructor() {
    super();
    let root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>:host{display:block;contain:content;}</style><slot></slot>`;
  }

  connectedCallback() {
    let self = this;
    
    let attr = (name) => self.getAttribute(name) || '';

    self.enterActive_ = attr('enter-active');
    self.enterFrom_ = attr('enter-from');
    self.enterTo_ = attr('enter-to');
    self.leaveActive_ = attr('leave-active');
    self.leaveFrom_ = attr('leave-from');
    self.leaveTo_ = attr('leave-to');

    if (self.show) {
      self.addClasses_(self.enterTo_);
    } else {
      self.addClasses_(self.leaveTo_);
    }
  }

  get show() {
    return this.hasAttribute('show');
  }

  set show(val) {
    let self = this;

    if (val) {
      self.setAttribute('show', '');
    } else {
      self.removeAttribute('show');
    }

    if (val) {
      self.onEnter_();
    } else {
      self.onLeave_();
    }
  }

  onEnter_() {
    let self = this;

    self.removeClasses_(self.leaveActive_);
    self.removeClasses_(self.leaveTo_);
    self.addClasses_(self.enterActive_);
    self.addClasses_(self.enterFrom_);

    self.animate_(
      () => {
        self.removeClasses_(self.enterFrom_)
        self.addClasses_(self.enterTo_)
      },
      () => self.removeClasses_(self.enterActive_),
    );
  }

  onLeave_() {
    let self = this;

    self.removeClasses_(self.enterActive_);
    self.removeClasses_(self.enterTo_);
    self.addClasses_(self.leaveActive_);
    self.addClasses_(self.leaveFrom_);

    self.animate_(
      () => {
        self.removeClasses_(self.leaveFrom_)
        self.addClasses_(self.leaveTo_)
      },
      () => self.removeClasses_(self.leaveActive_),
    );
  }

  animate_(setup, teardown) {
    this.addEventListener('transitionend', teardown, { once: true });
    this.addEventListener('animationend', teardown, { once: true });
    requestAnimationFrame(setup);
  }

  addClasses_(val) {
    this.classList.add(...val.split(' '));
  }

  removeClasses_(val) {
    this.classList.remove(...val.split(' '));
  }
}

customElements.define('x-transition', Transition);