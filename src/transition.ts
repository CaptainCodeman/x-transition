const evtOptions = { bubbles: true, composed: true }
const template = document.createElement('template')
template.innerHTML = '<style>:host{display:contents;}</style><slot></slot>'

const transitionAdd = 'x-transition-add'
const transitionDel = 'x-transition-del'
const transitionEnd = 'x-transition-end'

class Transition extends HTMLElement {
  private enter_: string[]
  private enterFrom_: string[]
  private enterTo_: string[]
  private leave_: string[]
  private leaveFrom_: string[]
  private leaveTo_: string[]
  private children_: number
  private el_: HTMLElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    this.addChild_ = this.addChild_.bind(this)
    this.removeChild_ = this.removeChild_.bind(this)
  }

  connectedCallback() {
    const attr = (name: string, fallback: string) => (
      this.getAttribute(name) || 
      this.getAttribute(fallback) ||
      ''
    )
      .split(' ')
      .filter(x => x)

    this.enter_ = attr('enter', 'with')
    this.enterFrom_ = attr('enter-from', 'hide')
    this.enterTo_ = attr('enter-to', 'show')
    this.leave_ = attr('leave', 'with')
    this.leaveFrom_ = attr('leave-from', 'show')
    this.leaveTo_ = attr('leave-to', 'hide')

    // count children using events
    this.children_ = 0
    this.addEventListener(transitionAdd, this.addChild_)
    this.addEventListener(transitionDel, this.removeChild_)
    this.dispatchEvent(new Event(transitionAdd, evtOptions))

    this.init_()
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event(transitionDel, evtOptions))
    this.removeEventListener(transitionAdd, this.addChild_)
    this.removeEventListener(transitionDel, this.removeChild_)
  }

  sameGroup_(e: Event) {
    return this.key === (e.target as Transition).key
  }

  addChild_(e: Event) {
    if (this.sameGroup_(e)) {
      this.children_++
    }
  }

  removeChild_(e: Event) {
    if (this.sameGroup_(e)) {
      this.children_--
    }
  }

  async init_() {
    await this.nextFrame_()

    // TODO: handle slotchange in case element is swapped
    this.el_ = this.shadowRoot!.querySelector('slot')!.assignedElements()[0] as HTMLElement
    if (this.open) {
      this.el_.style.display = ''
    } else {
      this.el_.style.display = 'none'
    }
  }

  get key() {
    return this.getAttribute('key')
  }

  get open() {
    return this.hasAttribute('open')
  }

  set open(val) {
    if (val) {
      this.setAttribute('open', '')
      this.onEnter_()
    } else {
      this.removeAttribute('open')
      this.onLeave_()
    }
  }

  async onEnter_() {
    this.el_.style.display = ''

    const completed = this.completed_()

    this.addClasses_(this.enter_)
    this.addClasses_(this.enterFrom_)

    await this.nextFrame_()

    const transitioned = this.transitioned_(this.enter_)

    this.removeClasses_(this.enterFrom_)
    this.addClasses_(this.enterTo_)

    await transitioned

    this.removeClasses_(this.enter_)
    this.removeClasses_(this.enterTo_)

    this.dispatchEvent(new Event('x-transition-end', evtOptions))

    await completed
  }

  async onLeave_() {
    const completed = this.completed_()

    this.addClasses_(this.leave_)
    this.addClasses_(this.leaveFrom_)

    await this.nextFrame_()

    const transitioned = this.transitioned_(this.leave_)

    this.removeClasses_(this.leaveFrom_)
    this.addClasses_(this.leaveTo_)

    await transitioned

    this.removeClasses_(this.leave_)
    this.removeClasses_(this.leaveTo_)

    this.dispatchEvent(new Event(transitionEnd, evtOptions))

    await completed

    this.el_.style.display = 'none'
  }

  addClasses_(val: string[]) {
    this.el_.classList.add(...val)
  }

  removeClasses_(val: string[]) {
    this.el_.classList.remove(...val)
  }

  nextFrame_() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  }

  transitioned_(transition: string[]) {
    // if no transition, resolve immediately
    return transition.length
      ? new Promise(resolve => this.addEventListener('transitionend', e => {
        e.stopPropagation()
        resolve()
      }, { once: true }))
      : Promise.resolve()
  }

  completed_() {
    // wait for completion of children via event count
    return new Promise(resolve => {
      let count = this.children_

      const handler = (e: Event) => {
        if (this.sameGroup_(e)) {
          if (--count === 0) {
            this.removeEventListener(transitionEnd, handler)
            resolve()
          }
        }
      }

      this.addEventListener(transitionEnd, handler)
    })
  }
}

customElements.define('x-transition', Transition)
