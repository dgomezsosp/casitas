class Casitas extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    try {
      // O si usas rutas tipo /elements/123
      const pathParts = window.location.pathname.split('/')
      const propertyIdFromPath = pathParts[pathParts.length - 1]

      // Construir el endpoint según si hay propertyId o no
      const endpoint = propertyIdFromPath && propertyIdFromPath !== 'elements'
        ? `/api/customer/elements/${propertyIdFromPath}`
        : '/api/customer/elements'

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      const data = await response.json()
      // Convertir a array si es un solo elemento
      this.data = Array.isArray(data) ? data : [data]
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = []
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          font-family: "Nunito Sans", serif;
        }

        .casitas-container {
          padding: 2rem;
        }

        .casitas-list {
          list-style: none;
          padding: 0;
        }

        .casita-item {
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
      </style>

      <section class="casitas-container">
        <h1>Casitas</h1>
        <ul class="casitas-list">
          ${this.data.map(casita => `
            <li class="casita-item">
              <strong>Property ID:</strong> ${casita.propertyId || 'N/A'} - 
              <strong>Título:</strong> ${casita.title || 'Sin título'}
            </li>
          `).join('')}
        </ul>
      </section>
    `
  }
}

customElements.define('casitas-component', Casitas)
