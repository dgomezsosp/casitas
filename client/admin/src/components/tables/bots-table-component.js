import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class BotsTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.filterQuery.query && currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${currentState.crud.filterQuery.query}`
        this.loadData(endpoint).then(() => this.render())
      }

      if (!currentState.crud.filterQuery.query && currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData (endpoint = this.endpoint) {
    try {
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = []
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      h1, h2, h3, h4, h5, h6, p{
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      ul{
        list-style-type: disc;
        margin: 0;
        padding: 0;
        padding-left: 1.5rem;
      }

      li{
        margin-top: 0;
      }

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }


      .table {
        display:flex;
        flex-direction: column;
        flex: 1;
        gap: 10px;
        border-radius: 10px;
      }

      .table__header {
        display: flex;
        justify-content: flex-start; 
        background-color: hsl(198, 100%, 85%);
        height: 30px;
        border-radius: 5px;
      }

      .table__header-icon{
        margin-left: 5px;
      }

      .table__header-icon ,
      .edit-button ,
      .delete-button ,
      .clean-icon,
      .save-icon,
      .table-page-logo {
        width: 30px;
        height: 30px;
        fill: black;
      }

      .table__header-icon svg:hover,
      .edit-button svg:hover,
      .delete-button svg:hover,
      .table-page-logo{
       
        fill: hsl(0 , 0% , 25%);
      }

      .table__body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 90%;
        margin: 1rem auto;
        min-height: 70vh;
        max-height: 70vh;
        overflow-y: auto;
        padding-right: 1rem;
      }

      .table__body::-webkit-scrollbar {
        width: 8px;
      }

      .table__body::-webkit-scrollbar-track {
        background: #e0e0e0; 
        border-radius: 10px;
      }

      .table__body::-webkit-scrollbar-thumb {
        background: hsl(200, 77%, 42%);
        border-radius: 10px;
      }

      .table__body::-webkit-scrollbar-thumb:hover {
        background: hsl(200, 77%, 32%); 
      }



      .table__body__user-box {
        color: white;

      }

      .user-box__data {
        padding: 15px;
        background-color: hsl(200, 77%, 36%);
        border-radius: 0 0 10px 10px;
      }

      .user-box__upper-row {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        background-color: hsl(198, 100%, 85%);
        border-radius: 10px 10px 0 0;
      }



      /* Footer de la tabla */
      .table__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background-color: hsl(198, 100%, 85%);
        border-radius: 5px;
      }

      .table__footer-box {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }

      .table-footer-info {
        text-align: left;
        color: rgb(0, 0, 0);
      }

      .table-page-logo svg {
        width: 30px;
        height: 30px;
        fill: rgb(0, 0, 0);
      }

      .table-footer-pagination {
        display: flex;
        gap: 0.25rem;
      }

      .table-footer-pagination-button {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .table-footer-pagination-button:hover {
        background-color: #f3f4f6;
      }

      .table-footer-pagination-button.disabled:hover {
        background-color: transparent;
        cursor: not-allowed;
      }

      .table-footer-pagination-button svg {
        fill: #6b7280;
        width: 1.5rem;
        height: 1.5rem;
        transition: fill 0.2s ease;
      }

      .table-footer-pagination-button svg {
        fill: hsl(200, 77%, 35%);
      }

      .table-footer-pagination-button.disabled svg {
        fill:rgb(85, 85, 85);
      }
    </style>

    <section class="table">
      <div class="table__header">
        <div class="table__header-box">
          <button class="filter-button table__header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>filter-check</title>
              <path
                d="M12 12V19.88C12.04 20.18 11.94 20.5 11.71 20.71C11.32 21.1 10.69 21.1 10.3 20.71L8.29 18.7C8.06 18.47 7.96 18.16 8 17.87V12H7.97L2.21 4.62C1.87 4.19 1.95 3.56 2.38 3.22C2.57 3.08 2.78 3 3 3H17C17.22 3 17.43 3.08 17.62 3.22C18.05 3.56 18.13 4.19 17.79 4.62L12.03 12H12M17.75 21L15 18L16.16 16.84L17.75 18.43L21.34 14.84L22.5 16.25L17.75 21" />
            </svg>
        </button>
        </div>
      </div>
      <div class="table__body"></div>
      <div class="table__footer">
        <div class="table__footer-box">
          <div class="table-footer-info">
            <span>${this.data.meta.total} registro en total, mostrando ${this.data.meta.size} por página</span>
          </div>
          <div class="table-footer-pagination">
            <div class="table-footer-pagination-button ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-double-left</title><path d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z" /></svg>
            </div>
            <div class="table-footer-pagination-button ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="${this.data.meta.currentPage > 1 ? this.data.meta.currentPage - 1 : 1}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-left</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
            </div>
            <div class="table-footer-pagination-button ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}"  data-page="${this.data.meta.currentPage < this.data.meta.pages ? this.data.meta.currentPage + 1 : this.data.meta.currentPage}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
            </div>
            <div class="table-footer-pagination-button ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}" data-page="${this.data.meta.pages}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-double-right</title><path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" /></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    `

    if (this.data.rows.length === 0) {
      const tableBody = this.shadow.querySelector('.table__body')
      const message = document.createElement('span')
      message.textContent = 'No hay ningún registro'
      tableBody.appendChild(message)
    }

    this.data.rows.forEach(element => {
      const tableBody = this.shadow.querySelector('.table__body')
      const userBox = document.createElement('div')
      userBox.classList.add('.table__body__user-box')
      tableBody.appendChild(userBox)

      const upperRow = document.createElement('div')
      upperRow.classList.add('user-box__upper-row')
      userBox.appendChild(upperRow)

      const editIcon = document.createElement('button')
      editIcon.classList.add('edit-button')
      editIcon.dataset.id = element.id
      upperRow.appendChild(editIcon)
      editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>editar</title>
                <path
                  d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>`
      const deleteIcon = document.createElement('button')
      deleteIcon.classList.add('delete-button')
      deleteIcon.dataset.id = element.id
      upperRow.appendChild(deleteIcon)
      deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>eliminar</title>
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>`

      const data = document.createElement('div')
      data.classList.add('user-box__data')
      userBox.appendChild(data)

      const ul = document.createElement('ul')
      data.appendChild(ul)

      const name = document.createElement('li')
      const nameLabel = document.createElement('span')
      nameLabel.textContent = 'Nombre: '
      nameLabel.style.fontWeight = 'bold'
      name.appendChild(nameLabel)
      name.append(` ${element.name}`)
      ul.appendChild(name)

      const platform = document.createElement('li')
      const platformLabel = document.createElement('span')
      platformLabel.textContent = 'Plataforma: '
      platformLabel.style.fontWeight = 'bold'
      platform.appendChild(platformLabel)
      platform.append(` ${element.platform}`)
      ul.appendChild(platform)

      const createdAt = document.createElement('li')
      const createdAtLabel = document.createElement('span')
      createdAtLabel.textContent = 'Fecha de creación: '
      createdAtLabel.style.fontWeight = 'bold'
      createdAt.appendChild(createdAtLabel)
      createdAt.append(` ${element.createdAt}`)
      ul.appendChild(createdAt)

      const updatedAt = document.createElement('li')
      const updatedAtLabel = document.createElement('span')
      updatedAtLabel.textContent = 'Fecha de actualización: '
      updatedAtLabel.style.fontWeight = 'bold'
      updatedAt.appendChild(updatedAtLabel)
      updatedAt.append(` ${element.updatedAt}`)
      ul.appendChild(updatedAt)
    })

    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.table').addEventListener('click', async event => {
      if (event.target.closest('.edit-button')) {
        const element = event.target.closest('.edit-button')
        const id = element.dataset.id
        const endpoint = `${this.endpoint}/${id}`

        try {
          const response = await fetch(endpoint)

          if (response.status === 500 || response.status === 404) {
            throw response
          }

          const data = await response.json()

          const formElement = {
            endPoint: this.endpoint,
            data
          }

          store.dispatch(showFormElement(formElement))
        } catch (error) {
          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'No se han podido recuperar el dato',
              type: 'error'
            }
          }))
        }
      }

      if (event.target.closest('.delete-button')) {
        const element = event.target.closest('.delete-button')
        const id = element.dataset.id
        document.dispatchEvent(new CustomEvent('showDeleteModal', {

          detail: {
            endpoint: this.endpoint,
            elementId: id
          }
        }))
      }

      if (event.target.closest('.filter-button')) {
        document.dispatchEvent(new CustomEvent('showFilterModal', {
          detail: {
            endpoint: this.endpoint
          }
        }))
      }

      if (event.target.closest('.table-footer-pagination-button') && !event.target.closest('.disabled')) {
        const page = event.target.closest('.table-footer-pagination-button').dataset.page
        let endpoint = `${this.endpoint}?page=${page}`

        if (this.filterQuery) {
          endpoint = `${endpoint}&${this.filterQuery}`
        }
        this.loadData(endpoint).then(() => this.render())
      }
    })
  }
}

customElements.define('bots-table-component', BotsTable)
