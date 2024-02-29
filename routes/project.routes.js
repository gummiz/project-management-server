
const router = require("express").Router()

router.get("/something", (req, res, next) =>{
    res.send("Hello")
})

module.exports = router