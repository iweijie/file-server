let config = require("./config/index")

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'file-service',
      script    : './index.js',
      watch     :  true ,
      ignore_watch : ["node_modules","static"],
      max_memory_restart : "200M" ,
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user: config.user,
      host: config.address,
      port: config.port,
      ref  : 'origin/master',
      ssh_options: "StrictHostKeyChecking=no",
      repo : 'git@github.com:weijie9520/file-server.git',
      path : '/weijie/file-server',
      'post-deploy' : 'yarn install && pm2 reload ecosystem.config.js --env production'
    },
  }
};
