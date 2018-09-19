
const path = require("path")

const uploadPath = path.join(__dirname, './static/uploads/')
const fileType = "music"
const transformName = "34234h2u3f2t34ft234.jpg"
var test = path.join(uploadPath, fileType ,transformName)
console.log(test)