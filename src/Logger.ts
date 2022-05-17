import FancyDate from './FancyDate';

export enum LogLevel {
    All = 0,
    Trace = 1,
    Debug = 2,
    Info = 3,
    Warn = 4,
    Error = 5,
    Off = 6,
}

export enum LoggerColor {
    Red = '#c0392b',
    Yellow = '#f39c12',
    BrightBlue = '#0096FF',
    NeonBlue = '#1F51FF',
    Cyan = '#00BCD4',
    Green = '#2ecc71',
    Gray = '#7f8c8d',
    BrightPurple = '#BF40BF',
    Purple = '#5D3FD3',
    Violet = '#CF9FFF',
}

export type LogObject = {
    tag: string;
    message: string;
    time: string;
};

export default class Logger {
    static #instance: Logger;
    #logLevel: LogLevel;
    #logs: LogObject[] = [];
    #recording = false;

    #getFancyStyle(bgColor: string) {
        return `background:${bgColor};border-radius:0.5em;color:white;font-weight:bold;padding:2px 0.5em;`;
    }

    #getBadgeColor(logLevel: LogLevel) {
        switch (logLevel) {
            case LogLevel.Error:
                return LoggerColor.Red;
            case LogLevel.Warn:
                return LoggerColor.Yellow;
        }
        return LoggerColor.Cyan;
    }

    get logLevel() {
        return this.#logLevel;
    }

    private constructor(level: LogLevel = LogLevel.All) {
        this.#logLevel = level;

        (window as any).__FancyLogger__ = this;
    }

    getLogs() {
        return this.#logs;
    }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new Logger();
        }
        return this.#instance;
    }

    debug(message: string | object, tag: string = 'debug', tagColor?: LoggerColor) {
        if (this.#logLevel > LogLevel.Debug) return;

        this.#logging('debug', message, tag, tagColor);
    }

    trace(message: string | object, tag: string = 'trace', tagColor?: LoggerColor) {
        if (this.#logLevel > LogLevel.Trace) return;

        this.#logging('trace', message, tag, tagColor);
    }

    log(message: string | object, tag: string = 'log', tagColor: LoggerColor = LoggerColor.BrightBlue) {
        if (this.#logLevel > LogLevel.Info) return;

        this.#logging('log', message, tag, tagColor);
    }

    warn(message: string | object, tag: string = 'warn', tagColor: LoggerColor = LoggerColor.Yellow) {
        if (this.#logLevel > LogLevel.Warn) return;

        this.#logging('warn', message, tag, tagColor);
    }

    error(message: string | object, tag: string = 'error', tagColor: LoggerColor = LoggerColor.Red) {
        if (this.#logLevel > LogLevel.Error) return;

        this.#logging('error', message, tag, tagColor);
    }

    setLogLevel(logLevel: LogLevel) {
        this.#logLevel = logLevel;
    }

    startRecord() {
        this.#recording = true;
    }

    stopRecord() {
        this.#recording = false;
    }

    saveRecord() {
        localStorage.setItem(`__FancyLogger__?Date=${FancyDate.now()}`, JSON.stringify(this.getLogs()));
    }

    #createLogObject(formattedMessage: string, tag: string): LogObject {
        return {
            tag,
            message: formattedMessage,
            time: FancyDate.now(),
        };
    }

    #logging(
        logType: 'debug' | 'trace' | 'log' | 'warn' | 'error',
        message: string | object,
        tag: string = 'log',
        customTagBgColor?: LoggerColor
    ) {
        const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;

        const logObject = this.#createLogObject(formattedMessage, tag);

        console[logType](
            `%c${tag}%c [%s] %c%s`,
            this.#getFancyStyle(customTagBgColor || this.#getBadgeColor(LogLevel.Info)),
            `color:${LoggerColor.Gray}`,
            logObject.time,
            `color:white`,
            logObject.message
        );

        if (this.#recording) {
            this.#logs.push(logObject);
        }
    }
}
