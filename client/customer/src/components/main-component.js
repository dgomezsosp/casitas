class MainComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      * {
        box-sizing: border-box;
      }

      main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
        gap: 20px;
        padding: 20px;
        width: 100%;
        height: calc(100vh - 80px); /* Resta la altura del header */
      }

      ::slotted(map-component) {
        grid-column: 1;
        grid-row: 1 / 3;
        height: 100%;
      }

      ::slotted(prompt-component) {
        grid-column: 2;
        grid-row: 1;
      }

      ::slotted(table-component) {
        grid-column: 2;
        grid-row: 2;
        overflow: auto;
      }
    </style>

    <main>
      <slot></slot>
    </main>
    `
  }
}

customElements.define('main-component', MainComponent)
