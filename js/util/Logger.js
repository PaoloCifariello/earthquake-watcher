class Logger {
    constructor() {
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

    _log(logType, ...msgList) {
        if (!this._isLoggable(logType))
            return;

        let style = this._styles[logType],
            finalMsg = "%c" + msgList.join(this._joinSymbol);

        console[logType].apply(console, [finalMsg, style]);
    }

    _isLoggable(logLevelId) {
        let logLevel = this.LogLevel[logLevelId];
        return logLevel <= EQ.logLevel;
    }
}

Logger.LogLevel = {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
};