# Casitas - Buscador Inteligente de Alquileres

Sistema completo de búsqueda de viviendas en alquiler en Mallorca con búsqueda semántica mediante inteligencia artificial.

## Descripción

Casitas es una aplicación web que combina web scraping, procesamiento de lenguaje natural y múltiples bases de datos para ofrecer una experiencia de búsqueda avanzada de propiedades en alquiler. El sistema extrae datos de Idealista, los procesa mediante OpenAI y permite realizar búsquedas en lenguaje natural que se traducen en consultas complejas a través de tres tipos diferentes de bases de datos.

## Características Principales

-   Búsqueda en lenguaje natural procesada con IA
-   Visualización interactiva en mapa con Google Maps
-   Web scraping automatizado de propiedades
-   Búsqueda vectorial semántica con ChromaDB
-   Búsqueda relacional con Neo4j
-   Bot de Telegram integrado
-   Interfaz responsive con Web Components

## Tecnologías

### Backend

-   Node.js con Express 5
-   Selenium WebDriver para scraping
-   OpenAI API para procesamiento de lenguaje natural
-   MongoDB para almacenamiento de datos
-   Neo4j para búsquedas relacionales
-   ChromaDB para búsqueda vectorial
-   WebSockets para comunicación en tiempo real

### Frontend

-   Web Components nativos
-   Redux Toolkit para gestión de estado
-   Google Maps JavaScript API
-   Vite como build tool
-   CSS3 para estilos

### Bases de Datos

-   MongoDB - Almacenamiento principal de propiedades
-   Neo4j - Relaciones entre propiedades y especificaciones
-   ChromaDB - Búsqueda vectorial semántica
-   MySQL - Datos administrativos

## Requisitos Previos

-   Node.js v18 o superior
-   MongoDB instalado y ejecutándose
-   Neo4j instalado y ejecutándose
-   ChromaDB
-   Google Chrome instalado
-   Cuenta de OpenAI con API key
-   Cuenta de Google Cloud con Maps API habilitado

## Instalación

### 1\. Clonar el repositorio

bash

    git clone https://github.com/tu-usuario/casitas.git
    cd casitas

### 2\. Instalar dependencias

bash

    npm install

### 3\. Configurar variables de entorno

#### API Backend (api/.env)

env

    NODE_ENV=development
    PORT=8080
    DEFAULT_LANGUAGE=es
    DATABASE_HOST=localhost
    DATABASE_DIALECT=mysql
    DATABASE_USER=root
    DATABASE_PASSWORD=tu_password
    DATABASE_NAME=telegram-bot
    MONGODB_URI=mongodb://localhost:27017/telegram-bot
    OPENAI_API_KEY=tu_api_key_openai
    NEO4J_DATABASE_URL=bolt://localhost:7687
    NEO4J_DATABASE_USER=neo4j
    NEO4J_DATABASE_PASSWORD=tu_password_neo4j
    NEO4J_DATABASE=neo4j
    CHROMADB_DATABASE=idealista-scrapping
    TELEGRAM_ADMIN_TOKEN=tu_token_telegram
    TELEGRAM_ADMIN_CHAT_ID=tu_chat_id

#### Cliente Customer (client/customer/.env)

env

    VITE_WS_URL=ws://localhost:8080
    VITE_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps
    VITE_GOOGLE_MAPS_ID=tu_map_id
    VITE_API_URL=http://localhost:8080

#### Scraping (scrapping/.env)

env

    OPENAI_API_KEY=tu_api_key_openai
    NEO4J_DATABASE_URL=bolt://localhost:7687
    NEO4J_DATABASE_USER=neo4j
    NEO4J_DATABASE_PASSWORD=tu_password
    NEO4J_DATABASE=neo4j
    CHROMADB_DATABASE=idealista-scrapping
    TELEGRAM_TOKEN=tu_token_telegram
    EXTRACT_KEYWORDS_BY_JSON_PROMPT_ID=tu_prompt_id
    CONSTRUCT_QUERY_PROMPT_ID=tu_prompt_id
    SEMANTIC_ANSWER_PROMPT_ID=tu_prompt_id

### 4\. Configurar base de datos MySQL

bash

    cd api
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all

### 5\. Configurar config.json de Sequelize

Copia el archivo `api/src/config/config-example.json` a `api/src/config/config.json` y ajusta las credenciales de tu base de datos.

## Uso

### Desarrollo

#### Iniciar todos los servicios

bash

    npm run dev

Este comando inicia:

-   Frontend de administración (puerto 5171)
-   Frontend de cliente (puerto 5177)
-   Proxy (puerto 80)

#### Iniciar API backend

bash

    cd api
    npm run dev

#### Iniciar solo frontend de cliente

bash

    cd client/customer
    npm run dev

### Proceso de Scraping

El scraping se realiza en varios pasos:

#### 1\. Extraer URLs de ubicaciones

bash

    cd scrapping
    node scrapping-locations.js

Esto genera el archivo `locations-urls.json` con todas las ubicaciones de Mallorca.

#### 2\. Realizar scraping de propiedades

bash

    node scrapping.js

Este proceso:

-   Lee las URLs de `locations-urls.json`
-   Extrae datos de cada propiedad
-   Guarda los resultados en `data/YYYY-MM-DD/`
-   Controla duplicados y reanuda desde donde se quedó

#### 3\. Cargar datos en ChromaDB

bash

    node store-chromadb.js

Procesa los archivos JSON y carga los embeddings en ChromaDB.

#### 4\. Cargar datos en Neo4j

bash

    node store-neo4j.js

Crea nodos y relaciones en la base de datos de grafos.

#### 5\. Cargar datos en MongoDB

bash

    node store-mongodb.js

Inserta los documentos completos en MongoDB.

### Bot de Telegram

bash

    cd scrapping
    node index.js
    ```
    
    Esto inicia el bot de Telegram que acepta consultas en lenguaje natural.
    
    ## Estructura del Proyecto
    ```
    casitas/
    ├── api/                          # Backend API
    │   ├── src/
    │   │   ├── controllers/         # Controladores de rutas
    │   │   ├── middlewares/         # Middlewares personalizados
    │   │   ├── models/              # Modelos de datos
    │   │   ├── routes/              # Definición de rutas
    │   │   ├── services/            # Lógica de negocio
    │   │   └── config/              # Configuración de Sequelize
    │   └── index.js                 # Punto de entrada del servidor
    │
    ├── client/                       # Frontend
    │   ├── admin/                   # Panel de administración
    │   └── customer/                # Aplicación de cliente
    │       ├── src/
    │       │   ├── components/      # Web Components
    │       │   └── redux/           # Store y slices de Redux
    │       └── pages/               # Páginas HTML
    │
    ├── scrapping/                    # Sistema de scraping
    │   ├── services/                # Servicios (OpenAI, Neo4j, etc.)
    │   ├── scrapping.js             # Script principal de scraping
    │   ├── store-chromadb.js        # Carga a ChromaDB
    │   ├── store-neo4j.js           # Carga a Neo4j
    │   ├── store-mongodb.js         # Carga a MongoDB
    │   └── index.js                 # Bot de Telegram
    │
    ├── proxy.js                      # Proxy inverso
    └── package.json                  # Dependencias raíz
    ```
    
    ## Arquitectura
    
    ### Flujo de Datos
    ```
    Usuario → Interfaz Web → API Express → Múltiples BBDD
                                          ├─ MongoDB (datos completos)
                                          ├─ Neo4j (relaciones)
                                          └─ ChromaDB (búsqueda semántica)
    ```
    
    ### Proceso de Búsqueda
    
    1. Usuario ingresa consulta en lenguaje natural
    2. OpenAI procesa la consulta y extrae:
       - Texto para búsqueda semántica (queryText)
       - Filtros estructurados (whereChromaDb)
       - Condiciones para Neo4j (whereNeo4j)
    3. ChromaDB busca el elemento más similar semánticamente
    4. Neo4j encuentra propiedades relacionadas aplicando filtros
    5. MongoDB recupera los datos completos
    6. OpenAI genera respuesta contextual
    7. Interfaz muestra resultados en mapa y tabla
    
    ## Funcionalidades Detalladas
    
    ### Búsqueda Inteligente
    
    La búsqueda acepta lenguaje natural como:
    - "Busco una casa con terraza y jardín de 2 habitaciones"
    - "Piso en Palma, menos de 1200 euros, con parking"
    - "Ático con vistas al mar en la zona de Can Picafort"
    
    El sistema automáticamente:
    - Extrae palabras clave para búsqueda semántica
    - Identifica filtros numéricos (precio, habitaciones, metros)
    - Detecta características especiales (terraza, parking, piscina)
    - Busca ubicaciones mencionadas
    
    ### Mapa Interactivo
    
    - Visualización de todas las propiedades en el mapa
    - Marcadores personalizados con Google Maps
    - Sincronización bidireccional con tabla de resultados
    - Click en marcador selecciona la propiedad en la tabla
    - Click en tabla hace zoom al marcador correspondiente
    - Restricción de área a Mallorca
    
    ### Web Components
    
    La aplicación usa Web Components nativos:
    - `page-component` - Navegación SPA
    - `main-component` - Layout principal
    - `map-component` - Mapa de Google
    - `prompt-component` - Barra de búsqueda
    - `table-component` - Lista de resultados
    - `casitas-component` - Vista de propiedades
    
    ### Redux State Management
    
    Estado global sincronizado:
    - `selectedProperty` - Propiedad seleccionada actualmente
    - `filterQuery` - Consulta de búsqueda activa
    - `formElement` - Estado de formularios
    - `tableEndpoint` - Endpoint de datos
    
    ## Prompts de OpenAI
    
    El sistema utiliza tres prompts principales:
    
    ### EXTRACT_KEYWORDS_BY_JSON_PROMPT_ID
    
    Convierte un JSON de propiedad en un array de palabras clave relevantes para búsqueda vectorial, excluyendo datos estructurados como metros, habitaciones y precio.
    
    ### CONSTRUCT_QUERY_PROMPT_ID
    
    Traduce lenguaje natural del usuario en:
    - `queryText`: Array de strings para búsqueda semántica
    - `whereChromaDb`: Objeto con filtros para ChromaDB
    - `whereNeo4j`: String con condiciones Cypher para Neo4j
    
    ### SEMANTIC_ANSWER_PROMPT_ID
    
    Genera respuesta contextual basada en la consulta del usuario y los datos encontrados, formateando la salida apropiadamente para Telegram o web.
    
    ## API Endpoints
    
    ### Búsqueda de Elementos
    ```
    GET /api/customer/elements
    ```
    
    Devuelve todas las propiedades disponibles.
    ```
    GET /api/customer/elements/:propertyId
    ```
    
    Devuelve una propiedad específica por ID.
    
    ### Búsqueda Inteligente
    ```
    POST /api/customer/search
    Content-Type: application/json
    
    {
      "query": "casa con jardín en Palma menos de 1500 euros"
    }

Realiza búsqueda en lenguaje natural y devuelve propiedades relevantes.

## Formato de Datos

### Estructura de Propiedad

javascript

    {
      "propertyId": "12345",
      "url": "https://www.idealista.com/...",
      "locationSlug": "palma-de-mallorca",
      "typeOfRental": "long-term",
      "title": "Piso en alquiler en Palma",
      "description": "Descripción de la propiedad...",
      "isAttic": false,
      "meters": 85,
      "rooms": 3,
      "price": 1200,
      "monthsDeposit": 2,
      "specifications": [
        "Terraza",
        "Aire acondicionado",
        "Amueblado"
      ],
      "bathrooms": 2,
      "floor": 3,
      "hasElevator": true,
      "energyConsumption": "D",
      "energyEmission": "D",
      "exactCoordinates": true,
      "latitude": 39.5696,
      "longitude": 2.6502
    }

## Solución de Problemas

### El scraping falla con timeout

-   Aumenta los tiempos de espera en `scrapping.js`
-   Verifica que Chrome esté instalado correctamente
-   Asegúrate de que el puerto 9222 esté disponible

### ChromaDB no encuentra resultados

-   Verifica que los embeddings se hayan generado correctamente
-   Revisa la conexión con OpenAI API
-   Comprueba que la colección existe en ChromaDB

### Neo4j no devuelve propiedades relacionadas

-   Verifica que los nodos y relaciones se hayan creado
-   Comprueba la sintaxis de las queries Cypher
-   Asegúrate de que los filtros whereNeo4j son válidos

### El mapa no carga

-   Verifica la API key de Google Maps
-   Comprueba que Maps JavaScript API esté habilitado
-   Revisa la consola del navegador para errores

### Error de CORS

-   Asegúrate de que el proxy esté ejecutándose
-   Verifica la configuración en `proxy.js`
-   Comprueba que los puertos coincidan

## Consideraciones de Producción

### Seguridad

-   Nunca commitear archivos `.env`
-   Usar variables de entorno en producción
-   Implementar rate limiting en API
-   Validar todas las entradas de usuario
-   Sanitizar queries a bases de datos

### Performance

-   Implementar caché para búsquedas frecuentes
-   Usar índices en MongoDB y Neo4j
-   Paginar resultados de búsqueda
-   Optimizar embeddings de ChromaDB
-   Comprimir respuestas HTTP

### Escalabilidad

-   Considerar separar scraping en workers
-   Implementar cola de mensajes (Redis/RabbitMQ)
-   Balancear carga con Nginx
-   Usar CDN para assets estáticos
-   Implementar clustering de Node.js

## Mantenimiento

### Actualización de Datos

Se recomienda ejecutar el scraping:

-   Semanalmente para datos actualizados
-   Usar `scrapping.js` que maneja duplicados
-   Revisar logs de errores regularmente

### Limpieza de Datos

bash

    # Eliminar propiedades antiguas de MongoDB
    db.collection.deleteMany({ 
      deletedAt: { $exists: true } 
    })
    
    # Limpiar ChromaDB
    # Usar store-chromadb.js con resetCollection()
    
    # Limpiar Neo4j
    MATCH (n) DETACH DELETE n



