import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class FeaturesTitlesForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/features-titles'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
      }

      h1, h2, h3, h4, h5, h6, p{
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
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

      ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .form__header-box{
        display: flex;
        justify-content: space-between; 
        align-items: center;
        background: hsl(198, 100%, 85%);
        border-radius: 5px;
        overflow: hidden;
      }

      .form__header-box-tabs {
        display: flex;
        color: white;
        height: 30px;
        border-radius: 5px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .form__header-box-filter:hover {
        background: hsl(200, 77%, 35%);
      }

      .form__header-box-tabs button {
        color: white;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        padding: 5px 15px;
      }

      .form__header-box-tabs button {
        color: hsl(200, 77%, 35%); 
        font-size: 16px;
      }

      .form__header-box-tabs button.active{
        background: hsl(200, 77%, 35%);
        color: hsl(0, 0.00%, 100.00%);
      }

      .form__header-icons {
        display: flex;
        gap: 10px; 
        margin-right: 5px;
      }

      .table__header__icon svg,
      .edit-icon svg,
      .delete-icon svg,
      .clean-icon,
      .save-icon {
        width: 30px;
        height: 30px;
        fill: black;
      }

      .table__header__icon svg:hover,
      .edit-icon svg:hover,
      .delete-icon svg:hover,
      .clean-icon:hover,
      .save-icon:hover {
        fill: hsl(0 , 0% , 25%);
      }

      .validation-errors{
        display: none;
      }

      .validation-errors.active{
        background-color: hsl(0, 51.90%, 54.30%);
        border-radius: 5px;
        display: block;
        margin: 1rem 0;
        padding: 1rem;
        position: relative;
      }

      .close-validation-errors{
        cursor: pointer;
        position: absolute;
        right: 1rem;
        top: 1rem;
      }

      .close-validation-errors svg{
        fill: hsl(100, 100%, 100%);
        height: 2rem;
        width: 2rem;
      }

      .validation-errors ul{
        display: flex;
        flex-direction: column;
      }

      .tab-content{
        display: none;
      }

      .tab-content.active{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-element {
        flex: 1;
        display:flex;
        flex-direction: column;
        gap: 10px 0px;
      }

      .form-element {
        margin: 10px 0;
      }

      .form-title{
        border-bottom: solid 1px;
      }

      .form-element-input input {
        width: 100%;
        padding: 10px;
        border: 1px solid hsl(200, 77%, 35%);
        border-radius: 5px;
        box-sizing: border-box;
        background: white;
        color: black;
      }

      .form-element-input select {
        width: 100%;
        padding: 10px;
        border: 1px solid hsl(200, 77%, 35%);
        border-radius: 5px;
        box-sizing: border-box;
        background: white;
        color: black;
        cursor: pointer;
      }

      .form-element-input textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid hsl(200, 77%, 35%);
        border-radius: 5px;
        box-sizing: border-box;
        background: white;
        color: black;
        resize: vertical;
        min-height: 80px;
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      .form-element.full-width {
        grid-column: 1 / -1; /
      }

      .form-element-input input:focus,
      .form-element-input select:focus,
      .form-element-input textarea:focus {
        outline: none;
        border-color: hsl(200, 77%, 35%);
        box-shadow: 0 0 0 3px hsla(200, 77%, 35%, 0.3);
        background-color: hsl(200, 77%, 98%);
      }

      .form-element-input .error{
        border: 1px solid hsl(0, 51.90%, 54.30%);
      }

      .form-element-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        grid-column: 1 / -1; /* Ocupa todo el ancho */
      }

      .form-element-group .form-element-input input {
        width: 100%;
      }
   
    </style>

    <section class="form">
      <div class="form__header">
        <div class="form__header-box">
          <div class="form__header-box-tabs">
            <button class="tab active" data-tab="general">General</button>
            <button class="tab" data-tab="images">Imagenes</button>
          </div>
          <div class="form__header-icons">
            <button class="clean-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>eraser</title>
                <path
                  d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" />
              </svg>
            </button>
            <button class="save-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>content-save</title>
                <path
                  d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="form__body">
        <div class="validation-errors">
          <ul></ul>
          <div class="close-validation-errors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
          </div>
        </div>
        <form>
          <input type="hidden" name="id">
          <div class="tab-content active" data-tab="general">
            <div class="form-element-group">
              <div class="form-element">
                <div class="form-title">
                  <span>Título característica:</span>
                </div>
                <div class="form-element-input">
                  <input type="text" placeholder="Título característica" name="title">
                </div>
              </div>
            </div>            
          </div>
          <div class="tab-content" data-tab="images">
            <div class="form-element">
              <div class="form-title">
                <span>Avatar:</span>
              </div>
              <div class="form-element-input">
                <input type="image" name="avatar">
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
    
    `
    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()

      if (event.target.closest('.save-icon')) {
        const form = this.shadow.querySelector('form')
        const formData = new FormData(form)
        const formDataJson = {}

        for (const [key, value] of formData.entries()) {
          formDataJson[key] = value !== '' ? value : null
        }

        const id = this.shadow.querySelector('[name="id"]').value
        const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
        const method = id ? 'PUT' : 'POST'
        delete formDataJson.id
        try {
          const response = await fetch(`${endpoint}`, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJson)
          })

          if (!response.ok) {
            throw response
          }

          this.closeValidationErrors()

          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()

          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'Datos guardados correctamente',
              type: 'success'
            }
          }))
        } catch (error) {
          if (error.status === 422) {
            const data = await error.json()
            this.validationErrors(data.message)

            document.dispatchEvent(new CustomEvent('notice', {
              detail: {
                message: 'Hay errores de validación en los datos',
                type: 'error'
              }
            }))
          }

          if (error.status === 500) {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: {
                message: 'No se han podido guardar los datos',
                type: 'error'
              }
            }))
          }
        }
      }

      if (event.target.closest('.clean-icon')) {
        this.resetForm()
        this.closeValidationErrors()
      }

      if (event.target.closest('.tab')) {
        this.shadow.querySelector('.tab.active').classList.remove('active')
        event.target.closest('.tab').classList.add('active')
        this.shadow.querySelector('.tab-content.active').classList.remove('active')
        this.shadow.querySelector(`.tab-content[data-tab='${event.target.closest('.tab').dataset.tab}']`).classList.add('active')
      }

      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }

  validationErrors (messages) {
    const validationErrorsContainer = this.shadow.querySelector('.validation-errors')
    validationErrorsContainer.classList.add('active')

    const validationList = this.shadow.querySelector('.validation-errors ul')
    validationList.innerHTML = ''

    this.shadow.querySelectorAll('.form-element-input .error').forEach(input => input.classList.remove('error'))

    messages.forEach(error => {
      const message = document.createElement('li')
      message.textContent = error.message
      validationList.appendChild(message)
      this.shadow.querySelector(`.form-element-input>[name='${error.path}']`).classList.add('error')
    })
  }

  closeValidationErrors () {
    const validationErrorsContainer = this.shadow.querySelector('.validation-errors')
    validationErrorsContainer.classList.remove('active')

    this.shadow.querySelectorAll('.form-element-input .error').forEach(input => {
      input.classList.remove('error')
    })
  }

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null

    this.closeValidationErrors()
  }
}

customElements.define('features-titles-form-component', FeaturesTitlesForm)
