const fs = require('fs')

const scv = fs.readFileSync('../current-deploy-contract/ServiceRegistry.json',{encoding:'utf8'});

let ct = JSON.parse(scv)
console.log(ct.abi)

fs.writeFileSync('../current-deploy-contract/abi-registry.json',JSON.stringify(ct.abi))