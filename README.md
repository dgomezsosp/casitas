
```
casitas
├─ api
│  ├─ .env
│  ├─ .env.example
│  ├─ .sequelizerc
│  ├─ eslint.config.js
│  ├─ index.js
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ config-example.json
│     │  └─ config.json
│     ├─ controllers
│     │  ├─ admin
│     │  ├─ auth-admin
│     │  └─ customer
│     │     ├─ element-controller.js
│     │     └─ search-controller.js
│     ├─ middlewares
│     │  ├─ error-handler.js
│     │  ├─ expose-services.js
│     │  ├─ user-agent.js
│     │  └─ user-tracking.js
│     ├─ migrations
│     ├─ models
│     │  ├─ mongoose
│     │  │  ├─ element.js
│     │  │  └─ index.js
│     │  └─ sequelize
│     ├─ routes
│     │  ├─ admin
│     │  ├─ auth-admin
│     │  ├─ customer
│     │  │  ├─ elements.js
│     │  │  └─ search.js
│     │  └─ index.js
│     ├─ seeders
│     │  └─ sequelize
│     └─ services
│        ├─ expose-services.js
│        ├─ graph-service.js
│        ├─ mongodb-service.js
│        ├─ openai-service.js
│        ├─ telegram-service.js
│        ├─ vector-service.js
│        └─ websocket-service.js
├─ client
│  ├─ admin
│  │  ├─ .env
│  │  ├─ .env.example
│  │  ├─ auth-admin
│  │  ├─ eslint.config.js
│  │  ├─ front-admin
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ pages
│  │  │  ├─ 404.html
│  │  │  ├─ bots.html
│  │  │  ├─ cards.html
│  │  │  ├─ customers.html
│  │  │  ├─ event-categories.html
│  │  │  ├─ events.html
│  │  │  ├─ faqs.html
│  │  │  ├─ features-titles.html
│  │  │  ├─ form-emails.html
│  │  │  ├─ hero.html
│  │  │  ├─ languages.html
│  │  │  ├─ promoters.html
│  │  │  ├─ spots.html
│  │  │  ├─ subscription-forms.html
│  │  │  └─ users.html
│  │  ├─ src
│  │  │  ├─ components
│  │  │  │  ├─ delete-modal-component.js
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ bots-filter-component.js
│  │  │  │  │  ├─ cards-filter-component.js
│  │  │  │  │  ├─ customers-filter-component.js
│  │  │  │  │  ├─ event-categories-filter-component.js
│  │  │  │  │  ├─ events-filter-component.js
│  │  │  │  │  ├─ faqs-filter-component.js
│  │  │  │  │  ├─ features-titles-filter-component.js
│  │  │  │  │  ├─ hero-filter-component.js
│  │  │  │  │  ├─ languages-filter-component.js
│  │  │  │  │  ├─ promoters-filter-component.js
│  │  │  │  │  ├─ spots-filter-component.js
│  │  │  │  │  ├─ subscription-forms-filter-component.js
│  │  │  │  │  └─ users-filter-component.js
│  │  │  │  ├─ font-loader-component.js
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ bots-form-component.js
│  │  │  │  │  ├─ cards-form-component.js
│  │  │  │  │  ├─ customers-form-component.js
│  │  │  │  │  ├─ event-categories-form-component.js
│  │  │  │  │  ├─ events-form-component.js
│  │  │  │  │  ├─ faqs-form-component.js
│  │  │  │  │  ├─ features-titles-form-component.js
│  │  │  │  │  ├─ hero-form-component.js
│  │  │  │  │  ├─ languages-form-component.js
│  │  │  │  │  ├─ promoters-form-component.js
│  │  │  │  │  ├─ spots-form-component.js
│  │  │  │  │  ├─ subscription-forms-form-component.js
│  │  │  │  │  └─ users-form-component.js
│  │  │  │  ├─ header-component.js
│  │  │  │  ├─ main-component.js
│  │  │  │  ├─ menu-component.js
│  │  │  │  ├─ message-component.js
│  │  │  │  ├─ not-found-component.js
│  │  │  │  ├─ page-component.js
│  │  │  │  ├─ tables
│  │  │  │  │  ├─ bots-table-component.js
│  │  │  │  │  ├─ cards-table-component.js
│  │  │  │  │  ├─ customers-table-component.js
│  │  │  │  │  ├─ event-categories-table-component.js
│  │  │  │  │  ├─ events-table-component.js
│  │  │  │  │  ├─ faqs-table-component.js
│  │  │  │  │  ├─ features-titles-table-component.js
│  │  │  │  │  ├─ form-emails-table-component.js
│  │  │  │  │  ├─ hero-table-component.js
│  │  │  │  │  ├─ languages-table-component.js
│  │  │  │  │  ├─ promoters-table-component.js
│  │  │  │  │  ├─ spots-table-component.js
│  │  │  │  │  ├─ subscription-forms-table-component.js
│  │  │  │  │  └─ users-table-component.js
│  │  │  │  └─ title-component.js
│  │  │  ├─ index.js
│  │  │  └─ redux
│  │  │     ├─ crud-slice.js
│  │  │     └─ store.js
│  │  ├─ style.css
│  │  └─ vite.config.js
│  └─ customer
│     ├─ .env
│     ├─ .env.example
│     ├─ app.css
│     ├─ eslint.config.js
│     ├─ index.html
│     ├─ package.json
│     ├─ pages
│     │  └─ home.html
│     ├─ src
│     │  ├─ components
│     │  │  ├─ casitas-component.js
│     │  │  ├─ main-component.js
│     │  │  ├─ map-component.js
│     │  │  ├─ page-component.js
│     │  │  ├─ prompt-component.js
│     │  │  └─ table-component.js
│     │  └─ index.js
│     └─ vite.config.js
├─ package.json
├─ proxy.js
└─ scrapping
   ├─ .env.example
   ├─ index.js
   ├─ locations-urls.json
   ├─ package.json
   ├─ README
   ├─ run-query.js
   ├─ scrapping-locations.js
   ├─ scrapping.js
   ├─ services
   │  ├─ graph-service.js
   │  ├─ mongodb-service.js
   │  ├─ openai-service.js
   │  ├─ telegram-service.js
   │  └─ vector-service.js
   ├─ store-chromadb.js
   ├─ store-mongodb.js
   └─ store-neo4j.js

```