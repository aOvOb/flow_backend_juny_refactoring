const app = require('./app.js')

const PORT = process.env.PORT || 1401

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT} ✔`)
})