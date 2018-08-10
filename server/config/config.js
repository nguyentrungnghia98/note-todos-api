var env = process.env.NODE_ENV || "development";

if (env === 'development' || env === 'test'){
    var config = require('./config.json');
    var envConfig = config[env];
    // config[env] => object env
    Object.keys(envConfig).forEach((key)=>{
        //Object.keys(envConfig) => ["PORT","MONGODB_URI"]
        process.env[key] = envConfig[key];
    });
}

