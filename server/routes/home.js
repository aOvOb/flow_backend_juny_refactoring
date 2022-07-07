const express = require('express')
const { outupt, process } = require('../controller/controller.js')

const router = express.Router()

// create
router.post('/insert', process.insert)
router.post('/insertFixed', process.insertFixed)

// read
router.get('/getAll', process.getAll)

// update
router.patch('/update', process.update)

// delete
router.delete('/delete/:SYS_ID', process.deleteData)

// search
// router.get('/search/:FW_EXT_NAME', process.search)

module.exports = router