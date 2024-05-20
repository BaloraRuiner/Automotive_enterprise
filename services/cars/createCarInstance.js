module.exports = (carInstance, db) => {
  return db('cars')
    .insert(carInstance)
    .returning([...Object.keys(carInstance), 'id']);
}