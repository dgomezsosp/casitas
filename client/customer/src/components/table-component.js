import { store } from '../redux/store.js'
import { setSelectedProperty } from '../redux/crud-slice.js'

class TableComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.selectedPropertyId = null
    this.unsubscribe = null
  }

  connectedCallback () {
    this.render()

    // Suscribirse a cambios en Redux
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      const newSelectedId = currentState.crud.selectedProperty

      // Si cambió la propiedad seleccionada desde el mapa
      if (newSelectedId !== this.selectedPropertyId) {
        this.selectedPropertyId = newSelectedId
        this.renderData()

        // Hacer scroll a la propiedad seleccionada si existe
        if (newSelectedId) {
          this.scrollToProperty(newSelectedId)
        }
      }
    })

    // Escuchar eventos de búsqueda
    document.addEventListener('search-results', (event) => {
      this.data = event.detail.data || []
      this.selectedPropertyId = null
      store.dispatch(setSelectedProperty(null))
      this.renderData()
    })
  }

  disconnectedCallback () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
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

      .property-card {
        padding: 15px;
        background-color: hsl(0, 0%, 98%);
        border: 1px solid hsl(0, 0%, 90%);
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .property-card:hover {
        background-color: white;
        border-color: hsl(200, 77%, 35%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .property-card.expanded {
        background-color: white;
        border-color: hsl(200, 77%, 35%);
        border-width: 2px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .property-card.collapsed {
        padding: 10px 15px;
      }

      .property-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: hsl(200, 77%, 25%);
        margin-bottom: 8px;
      }

      .property-card.collapsed .property-title {
        margin-bottom: 0;
      }

      .property-details-container {
        display: none;
      }

      .property-card.expanded .property-details-container {
        display: block;
      }

      .property-location {
        font-size: 0.95rem;
        color: hsl(0, 0%, 40%);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .property-details {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        font-size: 0.9rem;
        color: hsl(0, 0%, 50%);
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .property-price {
        font-size: 1.2rem;
        font-weight: 700;
        color: hsl(280, 56%, 47%);
        margin-top: 10px;
      }

      .location-icon {
        width: 16px;
        height: 16px;
        fill: hsl(0, 0%, 40%);
      }

      .property-link-button {
        display: inline-block;
        margin-top: 12px;
        padding: 10px 20px;
        background-color: hsl(200, 77%, 35%);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
      }

      .property-link-button:hover {
        background-color: hsl(200, 77%, 25%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .property-link-button:active {
        transform: translateY(0);
      }

      .property-link-button svg {
        width: 16px;
        height: 16px;
        fill: white;
        vertical-align: middle;
        margin-left: 6px;
      }
    </style>

    <div class="table-container">
      <div class="table-header">
        <span>Resultados</span>
        <span class="result-count">0 viviendas</span>
      </div>
      <div class="table-body">
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          <p>Realiza una búsqueda para ver resultados</p>
        </div>
      </div>
    </div>
    `
  }

  renderData () {
    const tableBody = this.shadow.querySelector('.table-body')
    const resultCount = this.shadow.querySelector('.result-count')

    tableBody.innerHTML = ''

    if (this.data.length === 0) {
      tableBody.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
          </svg>
          <p>No se encontraron viviendas relacionadas</p>
        </div>
      `
      resultCount.textContent = '0 viviendas'
      return
    }

    resultCount.textContent = `${this.data.length} ${this.data.length === 1 ? 'vivienda' : 'viviendas'}`

    this.data.forEach(property => {
      const card = document.createElement('div')
      card.className = 'property-card collapsed'
      card.dataset.propertyId = property.propertyId || property.id

      // Si esta propiedad está seleccionada, expandirla
      if (this.selectedPropertyId && (property.propertyId === this.selectedPropertyId || property.id === this.selectedPropertyId)) {
        card.classList.remove('collapsed')
        card.classList.add('expanded')
      }

      card.innerHTML = `
        <div class="property-title">${property.title || 'Sin título'}</div>
        <div class="property-details-container">
          <div class="property-location">
            <svg class="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
            ${property.locationSlug || 'Ubicación no disponible'}
          </div>
          <div class="property-details">
            ${property.rooms ? `<span class="detail-item">🛏️ ${property.rooms} hab.</span>` : ''}
            ${property.bathrooms ? `<span class="detail-item">🚿 ${property.bathrooms} baños</span>` : ''}
            ${property.meters ? `<span class="detail-item">📐 ${property.meters}m²</span>` : ''}
          </div>
          ${property.price ? `<div class="property-price">${property.price}€/mes</div>` : ''}
          ${property.url
? `
            <a href="${property.url}" target="_blank" rel="noopener noreferrer" class="property-link-button">
              Ver propiedad
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
            </a>
          `
: ''}
        </div>
      `

      card.addEventListener('click', (e) => {
        // No hacer nada si se clickeó el botón de enlace
        if (e.target.closest('.property-link-button')) {
          return
        }

        e.stopPropagation()
        this.handleCardClick(property.propertyId || property.id)
      })

      tableBody.appendChild(card)
    })
  }

  handleCardClick (propertyId) {
    // Si se clickea la misma propiedad que ya está expandida, colapsarla
    if (this.selectedPropertyId === propertyId) {
      this.selectedPropertyId = null
      store.dispatch(setSelectedProperty(null))
    } else {
      // Expandir la nueva propiedad
      this.selectedPropertyId = propertyId
      store.dispatch(setSelectedProperty(propertyId))
    }

    this.renderData()
  }

  scrollToProperty (propertyId) {
    setTimeout(() => {
      const card = this.shadow.querySelector(`[data-property-id="${propertyId}"]`)
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }
}

customElements.define('table-component', TableComponent)
