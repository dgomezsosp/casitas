module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      url: String,
      locationSlug: String,
      typeOfRental: String,
      title: String,
      description: String,
      isAttic: Boolean,
      meters: Number,
      rooms: Number,
      price: Number,
      monthsDeposit: Number,
      specifications: [String],
      bathrooms: Number,
      floor: Number,
      hasElevator: Boolean,
      energyConsumption: String,
      energyEmission: String,
      exactCoordinates: Boolean,
      latitude: Number,
      longitude: Number,
      deletedAt: Date
    },
    { 
      timestamps: true,
      strict: false // Permite campos adicionales no definidos en el schema
    }
  )

  const IdealistaScrapping = mongoose.model('IdealistaScrapping', schema, 'idealista-scrapping')
  return IdealistaScrapping
}