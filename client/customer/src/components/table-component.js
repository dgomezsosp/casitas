// import { store } from './redux/store.js'

class TableComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = null // Se definirá cuando se implemente
    this.data = []
    this.unsubscribe = null
  }

  connectedCallback () {
    // Cuando se implemente Redux, descomentar:
    // this.unsubscribe = store.subscribe(() => {
    //   const currentState = store.getState()
    //   // Aquí se manejará la lógica de actualización
    // })

    this.render()
  }

  disconnectedCallback () {
    // Cuando se implemente Redux, descomentar:
    // if (this.unsubscribe) {
    //   this.unsubscribe()
    // }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      * {
        box-sizing: border-box;
      }

      h1, h2, h3, h4, h5, h6, p {
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button {
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      .table-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 15px;
        background-color: hsl(198, 100%, 85%);
        border-radius: 10px;
        height: 100%;
        overflow: auto;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: hsl(200, 77%, 35%);
        color: white;
        border-radius: 5px;
        font-weight: 600;
      }

      .table-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background-color: white;
        border-radius: 5px;
      }

      .table-body::-webkit-scrollbar {
        width: 8px;
      }

      .table-body::-webkit-scrollbar-track {
        background: #e0e0e0;
        border-radius: 10px;
      }

      .table-body::-webkit-scrollbar-thumb {
        background: hsl(200, 77%, 42%);
        border-radius: 10px;
      }

      .table-body::-webkit-scrollbar-thumb:hover {
        background: hsl(200, 77%, 32%);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: hsl(0, 0%, 60%);
        gap: 10px;
      }

      .empty-state svg {
        width: 64px;
        height: 64px;
        fill: hsl(0, 0%, 80%);
      }

      .empty-state p {
        font-size: 1.1rem;
      }
    </style>

    <div class="table-container">
      <div class="table-header">
        <span>Resultados</span>
      </div>
      <div class="table-body">
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>table</title>
            <path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" />
          </svg>
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    </div>
    `
  }

  // Método preparado para cargar datos en el futuro
  async loadData (endpoint) {
    // try {
    //   const response = await fetch(endpoint)
    //
    //   if (!response.ok) {
    //     throw new Error(`Error fetching data: ${response.statusText}`)
    //   }
    //
    //   this.data = await response.json()
    //   this.renderData()
    // } catch (error) {
    //   console.error('Error loading data:', error)
    //   this.data = []
    // }
  }

  // Método preparado para renderizar datos
  renderData () {
    const tableBody = this.shadow.querySelector('.table-body')
    tableBody.innerHTML = ''

    if (this.data.length === 0) {
      tableBody.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>table</title>
            <path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" />
          </svg>
          <p>No hay datos para mostrar</p>
        </div>
      `
      return
    }

    // Aquí se renderizarán los datos cuando se implementen
    this.data.forEach(item => {
      // Renderizar cada item
    })
  }
}

customElements.define('table-component', TableComponent)
