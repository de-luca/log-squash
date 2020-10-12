export interface Logger {
    debug(...args: Array<any>): any;
    info(...args: Array<any>): any;
    warn(...args: Array<any>): any;
    error(...args: Array<any>): any;
}

export interface Log {
    level: Level,
    msg: string,
    config: LogConfig,
    additional: Array<any>,
}

export interface LogConfig {
    squashable?: boolean;
    pruneable?: boolean;
    squashIn?: string;
}

export enum Level {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export interface SquasherProps {
    logger?: Logger;
    debug?: boolean;
    squashStr?: string;
}


export default class Squasher {
    private _logs: Array<Log> = [];
    private _logger: Logger;
    private _debug: boolean;
    private _squashStr: string;
    
    public constructor(props: SquasherProps) {
        this._logger = props.logger || console;
        this._debug = props.debug || false;
        this._squashStr = props.squashStr || ' ';
    }

    public log(
        msg: string, 
        level: Level = Level.INFO, 
        config: LogConfig = {
            squashable: false,
            pruneable: false,
        },
        ...additional: Array<any>
    ): void {
        this._logs.push({
            level, 
            msg,
            config,
            additional,
        });
    }

    public debug(
        msg: string,
        config: LogConfig = {
            squashable: false,
            pruneable: false,
        },
        ...additional: Array<any>
    ): void {
        this.log(msg, Level.DEBUG, config, ...additional);
    }

    public info(
        msg: string,
        config: LogConfig = {
            squashable: false,
            pruneable: false,
        },
        ...additional: Array<any>
    ): void {
        this.log(msg, Level.INFO, config, ...additional);
    }

    public warn(
        msg: string,
        config: LogConfig = {
            squashable: false,
            pruneable: false,
        },
        ...additional: Array<any>
    ): void {
        this.log(msg, Level.WARN, config, ...additional);
    }

    public error(
        msg: string,
        config: LogConfig = {
            squashable: false,
            pruneable: false,
        },
        ...additional: Array<any>
    ): void {
        this.log(msg, Level.ERROR, config, ...additional);
    }

    public prune(): void {
        this._logs = this._logs.filter((value) => {
            if (value.config.pruneable) {
                return false;
            }

            if (value.level === Level.DEBUG && !this._debug) {
                return false;
            }

            return true;
        });
    }

    public squash(): void {
        this._logs = this._logs.reduce(
            (acc: Array<Log>, log: Log): Array<Log> => {
                const i = acc.length;

                if (log.config.squashable) {
                    if (i > 0 && acc[i - 1].config.squashable) {
                        acc[i - 1] = {
                            ...log,
                            msg: acc[i - 1].msg + this._squashStr + (log.config.squashIn || log.msg),
                        }
                    } else {
                        acc.push({
                            ...log,
                            msg: log.config.squashIn || log.msg,
                        });
                    }
                } else {
                    acc.push(log);
                }

                return acc;
            },
            [],
        );
    }

    public slice(start?: number, end?: number): void {
        this._logs = this._logs.slice(start, end);
    }

    public length(): number {
        return this._logs.length;
    }

    public output(): void {
        for (const log of this._logs) {
            if (log.level === Level.DEBUG && !this._debug) {
                continue;
            } else {
                this._logger[log.level](log.msg, ...log.additional);
            }
        }
    }
}