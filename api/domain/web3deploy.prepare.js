var Sequelize = require('sequelize');
// var sequelize = new Sequelize('peatio_production', 'root', null, {
    // host: "localhost",
    // logging: true,
    // timezone: "+08:00",  
    // port:3306,
    // define: {
    //     freezeTableName: true,
    //     underscored: true
    // },
    // dialect: 'mysql'
// });
const CONFIG = {
    ethereum:{
        rpc:"http://localhost:8545"
    },
    Api:{
        uploadProgress:{
            port:8101,
            hostname:"192.168.1.211",
            method:"POST",
            path:"/hkico/project/pay",
            timeout: 300000
        }
    }
}
exports.CONFIG = CONFIG;
exports.Sequelize = Sequelize;
// exports.sequelize = sequelize;