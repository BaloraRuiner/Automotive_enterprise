module.exports = (car, db) => {
  return db('cars').insert(car).returning([...Object.keys(car), 'id']);
}