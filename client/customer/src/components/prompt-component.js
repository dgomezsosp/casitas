class PromptComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/prompts' // Endpoint preparado para implementar después
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

      .submit-button:hover {
        background-color: hsl(200, 77%, 25%);
      }

      .submit-button:active {
        background-color: hsl(200, 77%, 20%);
      }
    </style>

    <div class="prompt-container">
      <input 
        type="text" 
        class="prompt-input" 
        placeholder="Escribe tu consulta aquí..."
        name="prompt"
      >
      <button class="submit-button">Enviar</button>
    </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    const submitButton = this.shadow.querySelector('.submit-button')
    const input = this.shadow.querySelector('.prompt-input')

    // Evento para el botón
    submitButton.addEventListener('click', () => {
      this.handleSubmit()
    })

    // Evento para Enter en el input
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmit()
      }
    })
  }

  async handleSubmit () {
    const input = this.shadow.querySelector('.prompt-input')
    const value = input.value.trim()

    if (!value) {
      console.log('El prompt está vacío')
      return
    }

    console.log('Prompt enviado:', value)

    // Aquí se implementará el POST al endpoint
    // try {
    //   const response = await fetch(this.endpoint, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ prompt: value })
    //   })
    //
    //   if (!response.ok) {
    //     throw response
    //   }
    //
    //   const data = await response.json()
    //   console.log('Respuesta:', data)
    //
    //   // Limpiar input después de enviar
    //   input.value = ''
    // } catch (error) {
    //   console.error('Error al enviar prompt:', error)
    // }

    // Por ahora solo limpiamos el input
    input.value = ''
  }
}

customElements.define('prompt-component', PromptComponent)
