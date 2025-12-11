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

  // Detectar ubicaciones específicas
  const locations = ['pollenca', 'pollença', 'palma', 'inca', 'manacor', 'alcudia', 'alcúdia',
    'soller', 'sóller', 'calvia', 'calvià', 'andratx', 'santanyi', 'santanyí',
    'cala-figuera', 'cala-millor', 'porto-cristo', 'portals-nous', 'camp-d-en-serralta']

  locations.forEach(loc => {
    const normalized = loc.replace(/-/g, ' ')
    if (lowerQuery.includes(normalized) || lowerQuery.includes(loc)) {
      criteria.location = loc
    }
  })

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
  return elements.filter(element => {
    // ===== FILTROS DE PRECIO =====

    if (criteria.maxPrice !== undefined) {
      if (!element.price || element.price > criteria.maxPrice) {
        return false
      }
    }

    if (criteria.minPrice !== undefined) {
      if (!element.price || element.price < criteria.minPrice) {
        return false
      }
    }

    // ===== FILTROS DE TAMAÑO =====

    if (criteria.minMeters !== undefined) {
      if (!element.meters || element.meters < criteria.minMeters) {
        return false
      }
    }

    if (criteria.maxMeters !== undefined) {
      if (!element.meters || element.meters > criteria.maxMeters) {
        return false
      }
    }

    // ===== FILTROS NUMÉRICOS =====

    // Habitaciones (permite ±1)
    if (criteria.rooms !== undefined) {
      if (!element.rooms || Math.abs(element.rooms - criteria.rooms) > 1) {
        return false
      }
    }

    // Baños (mínimo el solicitado)
    if (criteria.bathrooms !== undefined) {
      if (!element.bathrooms || element.bathrooms < criteria.bathrooms) {
        return false
      }
    }

    // ===== FILTROS DE UBICACIÓN =====

    if (criteria.location !== undefined) {
      if (!element.locationSlug || element.locationSlug !== criteria.location) {
        return false
      }
    }

    // ===== FILTROS DE TIPO =====

    if (criteria.isAttic !== undefined) {
      if (element.isAttic !== criteria.isAttic) {
        return false
      }
    }

    if (criteria.isDuplex) {
      const isDuplex = element.title?.toLowerCase().includes('dúplex') ||
                      element.title?.toLowerCase().includes('duplex') ||
                      element.description?.toLowerCase().includes('dúplex') ||
                      element.description?.toLowerCase().includes('duplex')
      if (!isDuplex) return false
    }

    // ===== FILTROS BOOLEANOS =====

    if (criteria.hasElevator !== undefined) {
      if (element.hasElevator !== criteria.hasElevator) {
        return false
      }
    }

    if (criteria.floor !== undefined) {
      if (element.floor !== criteria.floor) {
        return false
      }
    }

    // ===== FILTROS EN SPECIFICATIONS =====

    if (criteria.hasTerraza) {
      const hasTerraza = element.specifications?.some(spec =>
        spec.toLowerCase().includes('terraza')
      )
      if (!hasTerraza) return false
    }

    if (criteria.hasBalcon) {
      const hasBalcon = element.specifications?.some(spec =>
        spec.toLowerCase().includes('balcón') || spec.toLowerCase().includes('balcon')
      )
      if (!hasBalcon) return false
    }

    if (criteria.hasParking) {
      const hasParking = element.specifications?.some(spec =>
        spec.toLowerCase().includes('parking') ||
        spec.toLowerCase().includes('garaje') ||
        spec.toLowerCase().includes('aparcamiento')
      )
      if (!hasParking) return false
    }

    if (criteria.hasPiscina) {
      const hasPiscina = element.specifications?.some(spec =>
        spec.toLowerCase().includes('piscina')
      )
      if (!hasPiscina) return false
    }

    if (criteria.hasMuebles) {
      const hasMuebles = element.specifications?.some(spec =>
        spec.toLowerCase().includes('amueblado') || spec.toLowerCase().includes('amueblada')
      )
      if (!hasMuebles) return false
    }

    if (criteria.hasAireAcondicionado) {
      const hasAire = element.specifications?.some(spec =>
        spec.toLowerCase().includes('aire acondicionado')
      )
      if (!hasAire) return false
    }

    if (criteria.hasCalefaccion) {
      const hasCalefaccion = element.specifications?.some(spec =>
        spec.toLowerCase().includes('calefacción') || spec.toLowerCase().includes('calefaccion')
      )
      if (!hasCalefaccion) return false
    }

    if (criteria.hasCocinaEquipada) {
      const hasCocina = element.specifications?.some(spec =>
        spec.toLowerCase().includes('cocina equipada')
      )
      if (!hasCocina) return false
    }

    if (criteria.hasArmarios) {
      const hasArmarios = element.specifications?.some(spec =>
        spec.toLowerCase().includes('armarios empotrados')
      )
      if (!hasArmarios) return false
    }

    if (criteria.hasTrastero) {
      const hasTrastero = element.specifications?.some(spec =>
        spec.toLowerCase().includes('trastero')
      )
      if (!hasTrastero) return false
    }

    if (criteria.hasVistasMar) {
      const hasVistas = element.specifications?.some(spec =>
        spec.toLowerCase().includes('vistas al mar')
      )
      if (!hasVistas) return false
    }

    if (criteria.hasJardin) {
      const hasJardin = element.specifications?.some(spec =>
        spec.toLowerCase().includes('jardín') || spec.toLowerCase().includes('jardin')
      )
      if (!hasJardin) return false
    }

    return true
  })
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
    console.log('Criterios extraídos:', criteria)

    // 1. Buscar en ChromaDB el mejor match semántico
    const vectorService = new VectorService({
      collectionName: process.env.CHROMADB_DATABASE
    })

    const bestMatchId = await vectorService.searchBestMatch(query)

    if (!bestMatchId) {
      return res.status(404).send({
        message: 'No se encontraron resultados para tu búsqueda',
        data: []
      })
    }

    // 2. Buscar en Neo4j las viviendas relacionadas
    const relatedPropertyIds = await graphService.getRelatedElements(bestMatchId)

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

    // 4. Aplicar filtros según criterios extraídos
    if (Object.keys(criteria).length > 0) {
      elements = filterByCriteria(elements, criteria)
      console.log(`Filtrados: ${elements.length} de ${relatedPropertyIds.length} viviendas`)
    }

    res.status(200).send({
      message: `Se encontraron ${elements.length} viviendas que cumplen tus criterios`,
      data: elements,
      criteria // Incluir criterios para debugging
    })
  } catch (err) {
    console.error('Error en búsqueda:', err)
    next(err)
  } finally {
    await graphService.close()
  }
}
