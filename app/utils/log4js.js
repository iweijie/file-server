const log4js = require('log4js');

const config= {
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "logs/log_access/access",
            "pattern": "-yyyy-MM-dd",
            "category": "access"
        },
        "errors": {
            "type": "dateFile",
            "filename": "logs/log_errors/errors",
            "pattern": "-yyyy-MM",
            "category": "errors"
        }
    },
    "categories": {
        "default": { "appenders": ["access"], "level": "INFO" },
        "access": { "appenders": ["access"], "level": "INFO" },
        "errors": { "appenders": ["errors"], "level": "ERROR" },
    }
}

log4js.configure(config);

module.exports = {
    access: log4js.getLogger('access'),
    errors: log4js.getLogger('errors')
}