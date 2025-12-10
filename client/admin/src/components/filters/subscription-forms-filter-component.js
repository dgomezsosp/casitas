import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'

class SubcriptionFormsFilter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/subscription-forms'
    this.tableEndpoint = ''
    document.addEventListener('showFilterModal', this.showFilterModal.bind(this))
  }

  connectedCallback () {
    this.render()
  }

  showFilterModal (event) {
    if (event.detail.endpoint === this.endpoint) {
      this.shadow.querySelector('.overlay').classList.add('active')
    }
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          box-sizing: border-box;
        }
  
        .overlay {
          align-items: center;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          height: 100vh;
          justify-content: center;
          left: 0;
          position: fixed;
          top: 0;
          width: 100%;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }
  
        .overlay.active {
          opacity: 1;
          visibility: visible;
        }
  
        .filter-modal {
          background-color: #ffffff;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-radius: 12px;
          width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-20px);
          transition: transform 0.3s ease;
        }
  
        .overlay.active .filter-modal {
          transform: translateY(0);
        }
  
        .filter-field {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
  
        .filter-field label {
          font-weight: 600;
          color: #374151;
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.95rem;
        }
  
        .filter-field input {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #ffffff;
          color: #111827;
          font-family: "Nunito Sans", sans-serif;
          transition: all 0.2s ease;
        }

        .filter-field textarea {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #ffffff;
          color: #111827;
          font-family: "Nunito Sans", sans-serif;
          transition: all 0.2s ease;
          resize: vertical;
          min-height: 80px;
        }
  
        .filter-field input:focus,
        .filter-field textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
  
        .filter-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
  
        .filter-buttons button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: "Nunito Sans", sans-serif;
          font-weight: 600;
          transition: all 0.2s ease;
        }
  
        .apply-button {
          background-color: #6366f1;
          color: white;
        }
  
        .apply-button:hover {
          background-color: #4f46e5;
        }
  
        .reset-button {
          background-color: #f3f4f6;
          color: #111827;
        }
  
        .reset-button:hover {
          background-color: #e5e7eb;
        }
      </style>
  
      <div class="overlay">
        <div class="filter-modal">
          <form>
            <div class="filter-field">
              <label for="name">Nombre identificador:</label>
              <input type="text" id="name" name="name">
            </div>
          </form>
          <div class="filter-buttons">
            <button class="apply-button">Aplicar filtros</button>
            <button class="reset-button">Restablecer</button>
          </div>
        </div>
      </div>
      `
    this.renderButtons()
  }

  renderButtons () {
    const applyButton = this.shadow.querySelector('.apply-button')
    const resetButton = this.shadow.querySelector('.reset-button')
    const overlay = this.shadow.querySelector('.overlay')

    applyButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      overlay.classList.remove('active')
    })

    resetButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      form.reset()

      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      overlay.classList.remove('active')
    })

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active')
      }
    })
  }
}

customElements.define('subscription-forms-filter-component', SubcriptionFormsFilter)
