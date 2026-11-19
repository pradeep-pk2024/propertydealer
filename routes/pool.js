var mysql=require('mysql2')
const pool=mysql.createPool({host:'localhost',
    port:'3306',
    user:'root',
    password:'1234',
    database:'property',
    multipleStatements:'true',
    connectionLimit:'100',

})
module.exports=pool
