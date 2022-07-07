const dbService = require('../model/dbService')


const outupt = {
  // home : (req, res) => {
  //   // console.log("# # # req.body :", req.body)
  //   res.render("index")
  // }
}

const process = {  
  insert : (request, response) => {
    const client = request.body
    const db = dbService.getDbServiceInstance()
    
    const result = dbService.insertBanExt(client)

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))
  },

  insertFixed :  (request, response) => {
    const client = request.body
    const db = dbService.getDbServiceInstance()
    
    const result = dbService.insertFixedBanExt(client)

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))
  },

  getAll : async (request, response) => {
    const db = dbService.getDbServiceInstance()
    // let result2

    const result = db.getAllData()
    // const result2 = db.getAllCheckData()

    result.then(data => { response.json({ data: data[0], checkboxData: data[1] })}).catch(err => console.log(err))

  },

  update : (request, response) => {
    const client = request.body
    // console.log('이건 전문',client)
    const db = dbService.getDbServiceInstance()

    const result = dbService.updateNameById(client)
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err))
  },

  deleteData : (request, response) => {
    const { SYS_ID } = request.params
    const db = dbService.getDbServiceInstance()

    const result = dbService.deleteRowById(SYS_ID)
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err))
  },

  search : (request, response) => {
    const { FW_EXT_NAME } = request.params
    const db = dbService.getDbServiceInstance()

    const result = dbService.searchByName(FW_EXT_NAME)
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
  }
}

module.exports = {
  outupt,
  process
}