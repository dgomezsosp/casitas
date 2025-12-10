class Menu extends HTMLElement {
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

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }

      h1, h2, h3, h4, h5, h6, p{
        margin: 0;
      }
      
      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
          font-family: "Nunito Sans", serif;
          font-optical-sizing: auto;
        }


      img{
        object-fit: cover;
        width: 100%;
      }


      .header__menu svg {
        width: 30px;
        height: 30px;
        fill: white;
        cursor: pointer;
      }

    </style>
    
    <div class="header__menu">
      <div class="menu__logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>menu</title>
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        </svg>
      </div>
    </div>
  
    `
  }
}

customElements.define('menu-component', Menu)
