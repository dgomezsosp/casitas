class PromptComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/customer/search`
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

      h1, h2, h3, h4, h5, h6, p {
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button {
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }

      .prompt-container {
        display: flex;
        gap: 10px;
        padding: 15px;
        background-color: hsl(198, 100%, 85%);
        border-radius: 10px;
        align-items: center;
        height: 100%;
      }

      .prompt-input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid hsl(200, 77%, 35%);
        border-radius: 5px;
        background: white;
        color: black;
        font-size: 1rem;
      }

      .prompt-input:focus {
        outline: none;
        border-color: hsl(200, 77%, 35%);
        box-shadow: 0 0 0 3px hsla(200, 77%, 35%, 0.3);
        background-color: hsl(200, 77%, 98%);
      }

      .prompt-input:disabled {
        background-color: hsl(0, 0%, 95%);
        cursor: not-allowed;
      }

      .submit-button {
        padding: 12px 24px;
        background-color: hsl(200, 77%, 35%);
        color: white;
        border-radius: 5px;
        font-weight: 600;
        font-size: 1rem;
        transition: background-color 0.2s ease;
        cursor: pointer;
      }

      .submit-button:hover:not(:disabled) {
        background-color: hsl(200, 77%, 25%);
      }

      .submit-button:active:not(:disabled) {
        background-color: hsl(200, 77%, 20%);
      }

      .submit-button:disabled {
        background-color: hsl(0, 0%, 70%);
        cursor: not-allowed;
      }

      .error-message {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 5px;
        padding: 8px 12px;
        background-color: hsl(0, 70%, 95%);
        border: 1px solid hsl(0, 70%, 60%);
        border-radius: 5px;
        color: hsl(0, 70%, 30%);
        font-size: 0.9rem;
      }

      .wrapper {
        position: relative;
      }
    </style>

    <div class="wrapper">
      <div class="prompt-container">
        <input 
          type="text" 
          class="prompt-input" 
          placeholder="Ej: busco una casa con cocina grande y dos baños..."
          name="prompt"
        >
        <button class="submit-button">Buscar</button>
      </div>
      <div class="error-message" style="display: none;"></div>
    </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    const submitButton = this.shadow.querySelector('.submit-button')
    const input = this.shadow.querySelector('.prompt-input')

    submitButton.addEventListener('click', () => {
      this.handleSubmit()
    })

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmit()
      }
    })
  }

  showError (message) {
    const errorDiv = this.shadow.querySelector('.error-message')
    errorDiv.textContent = message
    errorDiv.style.display = 'block'

    setTimeout(() => {
      errorDiv.style.display = 'none'
    }, 5000)
  }

  setLoading (isLoading) {
    const input = this.shadow.querySelector('.prompt-input')
    const button = this.shadow.querySelector('.submit-button')

    input.disabled = isLoading
    button.disabled = isLoading
    button.textContent = isLoading ? 'Buscando...' : 'Buscar'
  }

  async handleSubmit () {
    const input = this.shadow.querySelector('.prompt-input')
    const value = input.value.trim()

    if (!value) {
      this.showError('Por favor, escribe una búsqueda')
      return
    }

    this.setLoading(true)

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: value })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en la búsqueda')
      }

      const data = await response.json()

      // Emitir evento personalizado con los resultados
      const event = new CustomEvent('search-results', {
        detail: {
          data: data.data || [],
          message: data.message,
          query: value
        },
        bubbles: true,
        composed: true
      })

      this.dispatchEvent(event)

      // Limpiar input después de búsqueda exitosa
      input.value = ''
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error)
      this.showError(error.message || 'Error al realizar la búsqueda')
    } finally {
      this.setLoading(false)
    }
  }
}

customElements.define('prompt-component', PromptComponent)
