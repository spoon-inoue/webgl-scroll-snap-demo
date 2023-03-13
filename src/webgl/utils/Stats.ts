import Stats from 'three/examples/jsm/libs/stats.module'

class _Stats {
  private stats: Stats

  constructor() {
    this.stats = Stats()
  }

  append(container: HTMLElement) {
    container.appendChild(this.stats.dom)
  }

  get premitive() {
    return this.stats
  }

  update() {
    this.stats.update()
  }
}

export const stats = new _Stats()
