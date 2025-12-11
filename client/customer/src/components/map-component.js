import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { store } from '../redux/store.js'
import { setSelectedProperty } from '../redux/crud-slice.js'

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: 'weekly',
  mapIds: [import.meta.env.VITE_GOOGLE_MAPS_ID]
})

class Map extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.markers = []
    this.data = []
    this.map = null
    this.selectedPropertyId = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    await this.render()

    // Suscribirse a cambios en Redux
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      const newSelectedId = currentState.crud.selectedProperty

      // Si cambió la propiedad seleccionada (desde la tabla)
      if (newSelectedId !== this.selectedPropertyId) {
        this.selectedPropertyId = newSelectedId
        this.updateMarkerStyles()

        // Hacer zoom a la propiedad si fue seleccionada desde la tabla
        if (newSelectedId) {
          this.zoomToProperty(newSelectedId)
        }
      }
    })

    // Escuchar eventos de búsqueda
    document.addEventListener('search-results', (event) => {
      this.selectedPropertyId = null
      this.updateMarkers(event.detail.data)
    })
  }

  disconnectedCallback () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  async render () {
    this.shadow.innerHTML =
    /* html */`<style>

      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .map {
        height: 100vh;
        width: 100%;
      }

      .gm-style iframe + div { border:none!important; }

      .empty-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 40px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        text-align: center;
        max-width: 400px;
        z-index: 1;
      }

      .empty-state svg {
        width: 64px;
        height: 64px;
        fill: hsl(200, 77%, 35%);
        margin-bottom: 15px;
      }

      .empty-state h3 {
        color: hsl(200, 77%, 25%);
        margin-bottom: 10px;
        font-size: 1.3rem;
      }

      .empty-state p {
        color: hsl(0, 0%, 40%);
        font-size: 1rem;
      }
    </style>

    <div class="map"></div>
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
      </svg>
      <h3>Realiza una búsqueda</h3>
      <p>Escribe lo que buscas en el campo de búsqueda para ver las viviendas en el mapa</p>
    </div>
    `

    await this.loadMap()
  }

  async loadMap () {
    if (this.map) return

    const { Map } = await importLibrary('maps')

    this.map = new Map(this.shadow.querySelector('.map'), {
      backgroundColor: 'hsl(217, 89%, 79%)',
      center: { lat: 39.6135612, lng: 2.8820133 },
      clickableIcons: false,
      disableDefaultUI: true,
      mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
      minZoom: 10,
      restriction: {
        latLngBounds: {
          east: 4.649715,
          north: 40.971935,
          south: 38.204442,
          west: 1.160065
        },
        strictBounds: true
      },
      zoom: 10
    })
  }

  async updateMarkers (data) {
    // Ocultar mensaje inicial
    const emptyState = this.shadow.querySelector('.empty-state')
    if (emptyState) {
      emptyState.style.display = 'none'
    }

    // Limpiar markers anteriores
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
    this.data = data || []

    if (!data || data.length === 0) {
      return
    }

    const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

    // Crear nuevos markers
    data.forEach((element) => {
      if (!element.latitude || !element.longitude) return

      const pinView = new PinElement({
        background: 'hsl(280deg 56% 47%)',
        borderColor: 'hsl(0deg 0% 0%)',
        glyphColor: 'hsl(0deg 0% 0%)'
      })

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: { lat: element.latitude, lng: element.longitude },
        title: element.title || element.propertyId,
        content: pinView.element
      })

      // Guardar referencia al PinElement y propertyId
      marker.pinView = pinView
      marker.propertyId = element.propertyId || element.id

      // Agregar event listener al marcador
      marker.addListener('click', () => {
        this.handleMarkerClick(marker.propertyId, marker.position)
      })

      this.markers.push(marker)
    })
  }

  handleMarkerClick (propertyId, position) {
    // Despachar la acción a Redux
    store.dispatch(setSelectedProperty(propertyId))
    this.selectedPropertyId = propertyId

    // Actualizar estilos de marcadores
    this.updateMarkerStyles()

    // Hacer un pequeño zoom hacia el marcador
    this.map.panTo(position)
    const currentZoom = this.map.getZoom()
    if (currentZoom < 14) {
      this.map.setZoom(14)
    }
  }

  updateMarkerStyles () {
    this.markers.forEach(marker => {
      const isSelected = marker.propertyId === this.selectedPropertyId

      // Actualizar el estilo del pin
      if (marker.pinView) {
        marker.pinView.background = isSelected
          ? 'hsl(280deg 56% 67%)' // Color más claro cuando está seleccionado
          : 'hsl(280deg 56% 47%)'  // Color normal

        marker.pinView.borderColor = isSelected
          ? 'hsl(280deg 56% 30%)' // Borde más oscuro cuando está seleccionado
          : 'hsl(0deg 0% 0%)'     // Borde normal

        marker.pinView.scale = isSelected ? 1.2 : 1 // Ligeramente más grande
      }
    })
  }

  zoomToProperty (propertyId) {
    const marker = this.markers.find(m => m.propertyId === propertyId)

    if (marker && marker.position) {
      // Animar el pan y zoom
      this.map.panTo(marker.position)

      const currentZoom = this.map.getZoom()
      if (currentZoom < 14) {
        this.map.setZoom(14)
      }
    }
  }
}

customElements.define('map-component', Map)
