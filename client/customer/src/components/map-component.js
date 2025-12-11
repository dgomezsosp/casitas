import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

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
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/elements`)
    this.data = await response.json()
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
    </style>

    <div class="map"></div>
    `

    await this.loadMap()
  }

  async loadMap () {
    if (this.map) return

    const { Map } = await importLibrary('maps')
    const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

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

    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []

    this.data.forEach((element) => {
      if (!element.latitude || !element.longitude) return

      const pinView = new PinElement({
        background: 'hsl(280deg 56% 47%)',
        borderColor: 'hsl(0deg 0% 0%)',
        glyphColor: 'hsl(0deg 0% 0%)'
      })

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: { lat: element.latitude, lng: element.longitude },
        title: element.aso_nom,
        content: pinView.element
      })

      this.markers.push(marker)
    })
  }
}

customElements.define('map-component', Map)
