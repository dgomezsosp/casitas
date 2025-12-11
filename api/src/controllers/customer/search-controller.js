const mongooseDb = require('../../models/mongoose')
const GraphService = require('../../services/graph-service')
const VectorService = require('../../services/vector-service')

/**
 * Extrae criterios de búsqueda de la query del usuario
 */
function extractSearchCriteria (query) {
  const criteria = {}
  const lowerQuery = query.toLowerCase()

  // ===== NÚMEROS =====

  // Extraer número de habitaciones
  const roomsMatch = lowerQuery.match(/(\d+)\s*(habitacion|habitaciones|hab\.|dormitorio|dormitorios)/i)
  if (roomsMatch) {
    criteria.rooms = parseInt(roomsMatch[1])
  }

  // Extraer número de baños
  const bathsMatch = lowerQuery.match(/(\d+)\s*(baño|baños|bano|banos)/i)
  if (bathsMatch) {
    criteria.bathrooms = parseInt(bathsMatch[1])
  }

  // Extraer metros cuadrados mínimos
  const minMetersMatch = lowerQuery.match(/(más de|mas de|mínimo|minimo|desde|min|como mínimo|como minimo)\s*(\d+)\s*(m2|metros|m²)/i)
  if (minMetersMatch) {
    criteria.minMeters = parseInt(minMetersMatch[2])
  }

  // Extraer metros cuadrados máximos
  const maxMetersMatch = lowerQuery.match(/(menos de|máximo|maximo|hasta|max|como máximo|como maximo)\s*(\d+)\s*(m2|metros|m²)/i)
  if (maxMetersMatch) {
    criteria.maxMeters = parseInt(maxMetersMatch[2])
  }

  // ===== PRECIO =====

  // Extraer precio máximo
  const maxPriceMatch = lowerQuery.match(/(menos de|máximo|maximo|hasta|max|como máximo|como maximo)\s*(\d+)\s*€?/i)
  if (maxPriceMatch) {
    criteria.maxPrice = parseInt(maxPriceMatch[2])
  }

  // Extraer precio mínimo
  const minPriceMatch = lowerQuery.match(/(más de|mas de|mínimo|minimo|desde|min|como mínimo|como minimo)\s*(\d+)\s*€?/i)
  if (minPriceMatch) {
    criteria.minPrice = parseInt(minPriceMatch[2])
  }

  // Extraer rango de precio (entre X y Y)
  const rangePriceMatch = lowerQuery.match(/entre\s*(\d+)\s*y\s*(\d+)\s*€?/i)
  if (rangePriceMatch) {
    criteria.minPrice = parseInt(rangePriceMatch[1])
    criteria.maxPrice = parseInt(rangePriceMatch[2])
  }

  // ===== UBICACIÓN =====

  // Extraer ubicación de forma dinámica
  // Buscar patrones como: "en X", "de X", "zona de X"
  const locationPatterns = [
    /\ben\s+([a-záéíóúñ\s-]+?)(?:\s+con|\s+de|\s+y|\s+,|$)/i,
    /\bzona\s+de\s+([a-záéíóúñ\s-]+?)(?:\s+con|\s+de|\s+y|\s+,|$)/i,
    /\bde\s+([a-záéíóúñ\s-]+?)(?:\s+con|\s+de|\s+y|\s+,|$)/i
  ]

  for (const pattern of locationPatterns) {
    const match = lowerQuery.match(pattern)
    if (match) {
      // Normalizar: quitar espacios extra, convertir a slug
      const location = match[1].trim()
        .replace(/\s+/g, '-')  // espacios a guiones
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ñ/g, 'n')

      criteria.locationSearch = location
      break
    }
  }

  // Si no encontró patrón, buscar nombres conocidos directamente
  if (!criteria.locationSearch) {
    const knownLocations = [
      'can-picafort', 'pollenca', 'pollença', 'palma', 'inca', 'manacor',
      'alcudia', 'alcúdia', 'soller', 'sóller', 'calvia', 'calvià', 'andratx',
      'santanyi', 'santanyí', 'cala-figuera', 'cala-millor', 'porto-cristo',
      'portals-nous', 'camp-d-en-serralta', 'sa-pobla', 'llucmajor', 'felanitx',
      'cala-ratjada', 'santa-ponsa', 'magaluf', 'peguera', 'cala-dor',
      'porto-colom', 'son-servera', 'capdepera', 'arta', 'muro'
    ]

    for (const loc of knownLocations) {
      const normalized = loc.replace(/-/g, ' ')
      if (lowerQuery.includes(normalized) || lowerQuery.includes(loc)) {
        criteria.locationSearch = loc
        break
      }
    }
  }

  // ===== TIPO DE VIVIENDA =====

  if (lowerQuery.includes('ático') || lowerQuery.includes('atico')) {
    criteria.isAttic = true
  }

  if (lowerQuery.includes('dúplex') || lowerQuery.includes('duplex')) {
    criteria.isDuplex = true
  }

  // ===== CARACTERÍSTICAS EN SPECIFICATIONS =====

  // Detectar si busca terraza
  if (lowerQuery.includes('terraza') || lowerQuery.includes('terrazas')) {
    criteria.hasTerraza = true
  }

  // Detectar si busca balcón
  if (lowerQuery.includes('balcón') || lowerQuery.includes('balcon')) {
    criteria.hasBalcon = true
  }

  // Detectar si busca parking/garaje
  if (lowerQuery.includes('parking') || lowerQuery.includes('garaje') || lowerQuery.includes('aparcamiento')) {
    criteria.hasParking = true
  }

  // Detectar si busca piscina
  if (lowerQuery.includes('piscina')) {
    criteria.hasPiscina = true
  }

  // Detectar si busca ascensor
  if (lowerQuery.includes('ascensor')) {
    criteria.hasElevator = true
  }

  // Detectar si busca amueblado
  if (lowerQuery.includes('amueblado') || lowerQuery.includes('amueblada')) {
    criteria.hasMuebles = true
  }

  // Detectar aire acondicionado
  if (lowerQuery.includes('aire acondicionado') || lowerQuery.includes('aire') || lowerQuery.includes('a/a')) {
    criteria.hasAireAcondicionado = true
  }

  // Detectar calefacción
  if (lowerQuery.includes('calefacción') || lowerQuery.includes('calefaccion')) {
    criteria.hasCalefaccion = true
  }

  // Detectar cocina equipada
  if (lowerQuery.includes('cocina equipada') || lowerQuery.includes('cocina')) {
    criteria.hasCocinaEquipada = true
  }

  // Detectar armarios empotrados
  if (lowerQuery.includes('armarios empotrados') || lowerQuery.includes('armarios')) {
    criteria.hasArmarios = true
  }

  // Detectar trastero
  if (lowerQuery.includes('trastero')) {
    criteria.hasTrastero = true
  }

  // Detectar vistas al mar
  if (lowerQuery.includes('vistas al mar') || lowerQuery.includes('vistas mar')) {
    criteria.hasVistasMar = true
  }

  // Detectar jardín
  if (lowerQuery.includes('jardín') || lowerQuery.includes('jardin')) {
    criteria.hasJardin = true
  }

  // ===== PLANTA =====

  // Detectar planta baja
  if (lowerQuery.includes('planta baja') || lowerQuery.includes('bajo')) {
    criteria.floor = 0
  }

  // Detectar primera planta
  if (lowerQuery.includes('primera planta') || lowerQuery.includes('primer piso')) {
    criteria.floor = 1
  }

  return criteria
}

/**
 * Aplica filtros a las viviendas según criterios extraídos
 */
function filterByCriteria (elements, criteria) {
  console.log('🔍 Iniciando filtrado con criterios:', JSON.stringify(criteria, null, 2))

  const results = elements.filter(element => {
    const reasons = [] // Para debugging

    // ===== FILTROS DE PRECIO =====

    if (criteria.maxPrice !== undefined) {
      if (!element.price || element.price > criteria.maxPrice) {
        reasons.push(`precio ${element.price} > ${criteria.maxPrice}`)
        return false
      }
    }

    if (criteria.minPrice !== undefined) {
      if (!element.price || element.price < criteria.minPrice) {
        reasons.push(`precio ${element.price} < ${criteria.minPrice}`)
        return false
      }
    }

    // ===== FILTROS DE TAMAÑO =====

    if (criteria.minMeters !== undefined) {
      if (!element.meters || element.meters < criteria.minMeters) {
        reasons.push(`metros ${element.meters} < ${criteria.minMeters}`)
        return false
      }
    }

    if (criteria.maxMeters !== undefined) {
      if (!element.meters || element.meters > criteria.maxMeters) {
        reasons.push(`metros ${element.meters} > ${criteria.maxMeters}`)
        return false
      }
    }

    // ===== FILTROS NUMÉRICOS =====

    // Habitaciones (permite ±1)
    if (criteria.rooms !== undefined) {
      if (!element.rooms || Math.abs(element.rooms - criteria.rooms) > 1) {
        reasons.push(`habitaciones ${element.rooms} vs ${criteria.rooms}`)
        return false
      }
    }

    // Baños (mínimo el solicitado)
    if (criteria.bathrooms !== undefined) {
      if (!element.bathrooms || element.bathrooms < criteria.bathrooms) {
        reasons.push(`baños ${element.bathrooms} < ${criteria.bathrooms}`)
        return false
      }
    }

    // ===== FILTROS DE UBICACIÓN =====

    if (criteria.locationSearch !== undefined) {
      if (!element.locationSlug) {
        reasons.push('sin locationSlug')
        return false
      }

      // Normalizar ambos para comparar
      const elementSlug = element.locationSlug.toLowerCase()
      const searchLocation = criteria.locationSearch.toLowerCase()

      // Coincidencia parcial (si busca "picafort" encuentra "can-picafort")
      if (!elementSlug.includes(searchLocation) && !searchLocation.includes(elementSlug)) {
        reasons.push(`ubicación ${elementSlug} no coincide con ${searchLocation}`)
        return false
      }
    }

    // ===== FILTROS DE TIPO =====

    if (criteria.isAttic !== undefined) {
      if (element.isAttic !== criteria.isAttic) {
        reasons.push(`isAttic ${element.isAttic} vs ${criteria.isAttic}`)
        return false
      }
    }

    if (criteria.isDuplex) {
      const isDuplex = element.title?.toLowerCase().includes('dúplex') ||
                      element.title?.toLowerCase().includes('duplex') ||
                      element.description?.toLowerCase().includes('dúplex') ||
                      element.description?.toLowerCase().includes('duplex')
      if (!isDuplex) {
        reasons.push('no es dúplex')
        return false
      }
    }

    // ===== FILTROS BOOLEANOS =====

    if (criteria.hasElevator !== undefined) {
      if (element.hasElevator !== criteria.hasElevator) {
        reasons.push(`ascensor ${element.hasElevator} vs ${criteria.hasElevator}`)
        return false
      }
    }

    if (criteria.floor !== undefined) {
      if (element.floor !== criteria.floor) {
        reasons.push(`planta ${element.floor} vs ${criteria.floor}`)
        return false
      }
    }

    // ===== FILTROS EN SPECIFICATIONS =====

    if (criteria.hasTerraza) {
      const hasTerraza = element.specifications?.some(spec =>
        spec.toLowerCase().includes('terraza')
      )
      if (!hasTerraza) {
        reasons.push(`no tiene terraza (specs: ${element.specifications?.join(', ') || 'ninguna'})`)
        return false
      }
    }

    if (criteria.hasBalcon) {
      const hasBalcon = element.specifications?.some(spec =>
        spec.toLowerCase().includes('balcón') || spec.toLowerCase().includes('balcon')
      )
      if (!hasBalcon) {
        reasons.push('no tiene balcón')
        return false
      }
    }

    if (criteria.hasParking) {
      const hasParking = element.specifications?.some(spec =>
        spec.toLowerCase().includes('parking') ||
        spec.toLowerCase().includes('garaje') ||
        spec.toLowerCase().includes('aparcamiento')
      )
      if (!hasParking) {
        reasons.push(`no tiene parking/garaje (specs: ${element.specifications?.join(', ') || 'ninguna'})`)
        return false
      }
    }

    if (criteria.hasPiscina) {
      const hasPiscina = element.specifications?.some(spec =>
        spec.toLowerCase().includes('piscina')
      )
      if (!hasPiscina) {
        reasons.push('no tiene piscina')
        return false
      }
    }

    if (criteria.hasMuebles) {
      const hasMuebles = element.specifications?.some(spec =>
        spec.toLowerCase().includes('amueblado') || spec.toLowerCase().includes('amueblada')
      )
      if (!hasMuebles) {
        reasons.push('no está amueblado')
        return false
      }
    }

    if (criteria.hasAireAcondicionado) {
      const hasAire = element.specifications?.some(spec =>
        spec.toLowerCase().includes('aire acondicionado')
      )
      if (!hasAire) {
        reasons.push('no tiene aire acondicionado')
        return false
      }
    }

    if (criteria.hasCalefaccion) {
      const hasCalefaccion = element.specifications?.some(spec =>
        spec.toLowerCase().includes('calefacción') || spec.toLowerCase().includes('calefaccion')
      )
      if (!hasCalefaccion) {
        reasons.push('no tiene calefacción')
        return false
      }
    }

    if (criteria.hasCocinaEquipada) {
      const hasCocina = element.specifications?.some(spec =>
        spec.toLowerCase().includes('cocina equipada')
      )
      if (!hasCocina) {
        reasons.push('no tiene cocina equipada')
        return false
      }
    }

    if (criteria.hasArmarios) {
      const hasArmarios = element.specifications?.some(spec =>
        spec.toLowerCase().includes('armarios empotrados')
      )
      if (!hasArmarios) {
        reasons.push('no tiene armarios empotrados')
        return false
      }
    }

    if (criteria.hasTrastero) {
      const hasTrastero = element.specifications?.some(spec =>
        spec.toLowerCase().includes('trastero')
      )
      if (!hasTrastero) {
        reasons.push('no tiene trastero')
        return false
      }
    }

    if (criteria.hasVistasMar) {
      const hasVistas = element.specifications?.some(spec =>
        spec.toLowerCase().includes('vistas al mar')
      )
      if (!hasVistas) {
        reasons.push('no tiene vistas al mar')
        return false
      }
    }

    if (criteria.hasJardin) {
      const hasJardin = element.specifications?.some(spec =>
        spec.toLowerCase().includes('jardín') || spec.toLowerCase().includes('jardin')
      )
      if (!hasJardin) {
        reasons.push('no tiene jardín')
        return false
      }
    }

    // Si pasó todos los filtros
    console.log(`✅ ${element.propertyId} PASÓ todos los filtros`)
    return true
  })

  // Mostrar ejemplos de viviendas descartadas
  const rejected = elements.filter(el => !results.includes(el))
  if (rejected.length > 0) {
    console.log('❌ Ejemplos de viviendas descartadas (mostrando primeras 3):')
    rejected.slice(0, 3).forEach(el => {
      console.log(`  ${el.propertyId}: specs = [${el.specifications?.join(', ') || 'ninguna'}]`)
    })
  }

  return results
}

exports.search = async (req, res, next) => {
  const graphService = new GraphService()

  try {
    const { query } = req.body

    if (!query || query.trim() === '') {
      return res.status(400).send({ message: 'El campo query es obligatorio' })
    }

    // Extraer criterios de búsqueda
    const criteria = extractSearchCriteria(query)
    console.log('🔍 Criterios extraídos:', JSON.stringify(criteria, null, 2))

    // 1. Buscar en ChromaDB el mejor match semántico
    const vectorService = new VectorService({
      collectionName: process.env.CHROMADB_DATABASE
    })

    const bestMatchId = await vectorService.searchBestMatch(query)
    console.log('📍 Mejor match de ChromaDB:', bestMatchId)

    if (!bestMatchId) {
      return res.status(404).send({
        message: 'No se encontraron resultados para tu búsqueda',
        data: []
      })
    }

    // 2. Buscar en Neo4j las viviendas relacionadas
    const relatedPropertyIds = await graphService.getRelatedElements(bestMatchId)
    console.log('🔗 Viviendas relacionadas de Neo4j:', relatedPropertyIds.length)

    if (!relatedPropertyIds || relatedPropertyIds.length === 0) {
      return res.status(200).send({
        message: 'No se encontraron viviendas relacionadas',
        data: []
      })
    }

    // 3. Obtener los datos completos de MongoDB
    let elements = await mongooseDb.Element.find({
      propertyId: { $in: relatedPropertyIds }
    })
    console.log('📦 Viviendas recuperadas de MongoDB:', elements.length)

    // 4. Aplicar filtros según criterios extraídos
    if (Object.keys(criteria).length > 0) {
      const beforeFilter = elements.length
      elements = filterByCriteria(elements, criteria)
      console.log(`✂️ Filtradas: ${elements.length} de ${beforeFilter} viviendas`)

      // Debug: mostrar especificaciones de las primeras 3 viviendas
      if (elements.length > 0 && elements.length <= 10) {
        console.log('📋 Especificaciones de resultados:')
        elements.slice(0, 3).forEach(el => {
          console.log(`  - ${el.propertyId}: ${el.specifications?.join(', ') || 'Sin specs'}`)
        })
      }
    }

    // Construir mensaje descriptivo
    let message = `Se encontraron ${elements.length} viviendas`
    const criteriaDescriptions = []

    if (criteria.hasTerraza) criteriaDescriptions.push('con terraza')
    if (criteria.hasParking) criteriaDescriptions.push('con parking/garaje')
    if (criteria.hasPiscina) criteriaDescriptions.push('con piscina')
    if (criteria.rooms) criteriaDescriptions.push(`${criteria.rooms} habitaciones`)
    if (criteria.bathrooms) criteriaDescriptions.push(`${criteria.bathrooms}+ baños`)
    if (criteria.maxPrice) criteriaDescriptions.push(`hasta ${criteria.maxPrice}€`)
    if (criteria.locationSearch) criteriaDescriptions.push(`en ${criteria.locationSearch}`)

    if (criteriaDescriptions.length > 0) {
      message += ' ' + criteriaDescriptions.join(', ')
    }

    res.status(200).send({
      message,
      data: elements,
      debug: {
        criteriaExtracted: criteria,
        totalFromNeo4j: relatedPropertyIds.length,
        afterFiltering: elements.length
      }
    })
  } catch (err) {
    console.error('Error en búsqueda:', err)
    next(err)
  } finally {
    await graphService.close()
  }
}
