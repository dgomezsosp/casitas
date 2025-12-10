class Header extends HTMLElement {
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

      
    /* Opción 3: Overlay más marcado */
    header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 20px 20px;
      /* Hereda el fondo y lo oscurece */
      background: inherit;
      filter: brightness(0.95);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
   
    </style>

    <header>
      <slot></slot>
    </header>
    
    `
  }
}

customElements.define('header-component', Header)
