/**
 * Configure option.
 */
var config = {
    db:{
        user:'*',
        password:'*',
        port:27017,
        host:'*'
    },
    app:{
        host:'127.0.0.1',
        port:'10086'
    },
    cluster:{
        worker:3    //worker=0 start child process by cpus.length  ,  worker>0 start child process by worker number.
    }
};

module.exports = config;
