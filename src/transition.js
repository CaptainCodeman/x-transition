let evtOptions = { bubbles: true, composed: true }
let template = document.createElement('template')
template.innerHTML = '<style>:host{display:contents;}</style><slot></slot>'

class Transition extends HTMLElement {
  constructor() {
    super();
    let self = this;
    let root = self.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
    self.addChild_ = self.addChild_.bind(this);
    self.removeChild_ = self.removeChild_.bind(this);
    self.ael_ = self.addEventListener;
    self.rel_ = self.removeEventListener;
    self.de_ = self.dispatchEvent;
  }

  connectedCallback() {
    let self = this;

    let attr = (name) => (self.getAttribute(name) || '').split(' ').filter(x => x);

    self.enter_ = attr('enter');
    self.enterFrom_ = attr('enter-from');
    self.enterTo_ = attr('enter-to');
    self.leave_ = attr('leave');
    self.leaveFrom_ = attr('leave-from');
    self.leaveTo_ = attr('leave-to');

    // count children using events
    self.children_ = 0;
    self.ael_('x-transition-add', self.addChild_);
    self.ael_('x-transition-remove', self.removeChild_);
    self.de_(new Event('x-transition-add', evtOptions));

    self.init_();
  }

  disconnectedCallback() {
    let self = this;
    self.de_(new Event('x-transition-remove', evtOptions));
    self.rel_('x-transition-add', self.addChild_);
    self.rel_('x-transition-remove', self.removeChild_);
  }

  addChild_() {
    this.children_++;
  }

  removeChild_() {
    this.children_--;
  }

  async init_() {
    let self = this;

    await self.nextFrame_();

    // TODO: handle slotchange in case element is swapped
    self.el_ = self.shadowRoot.querySelector('slot').assignedElements()[0];
    if (self.open) {
      self.el_.style.display = '';
    } else {
      self.el_.style.display = 'none';
    }
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    let self = this;

    if (val) {
      self.setAttribute('open', '');
      self.onEnter_();
    } else {
      self.removeAttribute('open');
      self.onLeave_();
    }
  }

  async onEnter_() {
    let self = this;

    self.el_.style.display = '';

    let completed = self.completed_();

    self.addClasses_(self.enter_);
    self.addClasses_(self.enterFrom_);

    await self.nextFrame_();

    let transitioned = self.transitioned_(self.enter_);

    self.removeClasses_(self.enterFrom_);
    self.addClasses_(self.enterTo_);

    await transitioned;

    self.removeClasses_(self.enter_);
    self.removeClasses_(self.enterTo_);

    self.de_(new Event('x-transition-end', evtOptions));

    await completed;
  }

  async onLeave_() {
    let self = this;

    let completed = self.completed_();

    self.addClasses_(self.leave_);
    self.addClasses_(self.leaveFrom_);

    await self.nextFrame_();

    let transitioned = self.transitioned_(self.leave_);

    self.removeClasses_(self.leaveFrom_);
    self.addClasses_(self.leaveTo_);

    await transitioned;

    self.removeClasses_(self.leave_);
    self.removeClasses_(self.leaveTo_);

    self.de_(new Event('x-transition-end', evtOptions));

    await completed;

    self.el_.style.display = 'none';
  }

  addClasses_(val) {
    this.el_.classList.add(...val);
  }

  removeClasses_(val) {
    this.el_.classList.remove(...val);
  }

  nextFrame_() {
    let raf = requestAnimationFrame;
    return new Promise(resolve => raf(() => raf(resolve)));
  }

  transitioned_(transition) {
    // if no transition, resolve immediately
    return transition.length
      ? new Promise(resolve => this.ael_('transitionend', e => {
          e.stopPropagation();
          resolve();
        }, { once: true }))
      : Promise.resolve();
  }

  completed_() {
    // wait for completion of children via event count
    let self = this;

    return new Promise(resolve => {
      let count = self.children_;

      let handler = _ => {
        count--;
        if (count === 0) {
          self.rel_('x-transition-end', handler);
          resolve();
        }
      };

      self.ael_('x-transition-end', handler);
    });
  }
}

customElements.define('x-transition', Transition);
