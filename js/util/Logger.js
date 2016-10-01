export default class Logger {
    constructor(logLevel) {
        this._logLevel = logLevel;
        this.LogLevel = Logger.LogLevel;

        this._styles = {
            error: 'color: yellow; background: #FF4040',
            warn: 'color: #FF4040; background: #eed482',
            info: 'color: blue',
            debug: 'color: green'
        };

        this._joinSymbol = ' ';

        $.each(this.LogLevel, (logLevel) => {
            this[logLevel] = ((...args) => {
                this._log(logLevel, ...args);
            });
        });
    }

    static get LogLevel() {
        return {
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        };
    }  

    setLogLevel(logLevel) {
        if ($.isNumeric(logLevel) && logLevel > -1)
            this._logLevel = logLevel;
    }

    _log(logType, ...msgList) {
        if (!this._isLoggable(logType))
            return;

        let style = this._styles[logType],
            finalMsg = "%c" + msgList.join(this._joinSymbol);

        console[logType].apply(console, [finalMsg, style]);
    }

    _isLoggable(logLevelId) {
        let logLevel = this.LogLevel[logLevelId];
        return logLevel <= this._logLevel;
    }
}