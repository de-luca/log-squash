import Squasher, { Level, Log } from './index';

afterEach(() => {
    jest.resetAllMocks();
});

describe('Squasher.log', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.log('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.INFO);
    });

    it('adds logs in groups', async() => {
        const squasher = new Squasher({});
        await Promise.all([
            async function() {
                squasher.log('1', Level.INFO, { group: 'g1' });
                squasher.log('2', Level.INFO, { group: 'g1' });
                squasher.log('3', Level.INFO, { group: 'g1' });
                squasher.log('4', Level.INFO, { group: 'g1' });
                squasher.log('5', Level.INFO, { group: 'g1' });
            }(),
            async function() {
                squasher.log('1', Level.INFO, { group: 'g2' });
                squasher.log('2', Level.INFO, { group: 'g2' });
                squasher.log('3', Level.INFO, { group: 'g2' });
                squasher.log('4', Level.INFO, { group: 'g2' });
                squasher.log('5', Level.INFO, { group: 'g2' });
            }(),
        ]);
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs.filter(log => log.config.group === 'g1')).toHaveLength(5);
        expect(logs.filter(log => log.config.group === 'g2')).toHaveLength(5);
    });
});

describe('Squasher.debug', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.debug('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.DEBUG);
    });
});

describe('Squasher.info', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.info('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.INFO);
    });
});

describe('Squasher.warn', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.warn('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.WARN);
    });
});

describe('Squasher.error', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.error('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.ERROR);
    });
});

describe('Squasher.length', () => {
    it('return logs length', () => {
        const squasher = new Squasher({});
        squasher.log('foo');
        squasher.log('bar');
        squasher.log('baz');
        
        expect(squasher.length()).toEqual(3);
    });

    it('return logs length of group', async () => {
        const squasher = new Squasher({});
        await Promise.all([
            async function () {
                squasher.log('1', Level.INFO, { group: 'g1' });
                squasher.log('2', Level.INFO, { group: 'g1' });
            }(),
            async function () {
                squasher.log('1', Level.INFO, { group: 'g2' });
                squasher.log('2', Level.INFO, { group: 'g2' });
                squasher.log('3', Level.INFO, { group: 'g2' });
            }(),
        ]);
        expect(squasher.length('g1')).toEqual(2);
        expect(squasher.length('g2')).toEqual(3);
    });
});

describe('Squasher.prune', () => {
    it('prunes droppable logs', () => {
        const squasher = new Squasher({});
        squasher.info('foo');
        squasher.debug('bar');
        squasher.warn('baz', { pruneable: true });
        squasher.prune();
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.INFO);
    });

    it('prunes logs if given group', async () => {
        const squasher = new Squasher({});
        await Promise.all([
            async function () {
                squasher.info('1', { group: 'g1' });
            }(),
            async function () {
                squasher.debug('1', { group: 'g2' });
                squasher.info('2', { group: 'g2', pruneable: true });
                squasher.debug('3', { group: 'g2' });
                squasher.info('4', { group: 'g2' });
                squasher.debug('5', { group: 'g2' });
            }(),
        ]);
        squasher.prune('g2');
        const logs: Array<Log> = (squasher as any)._logs
            .filter((log: Log) => log.config.group === 'g2');
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('4');
        expect(logs[0].level).toEqual(Level.INFO);
    });
});

describe('Squasher.slice', () => {
    it('slices the logs', () => {
        const squasher = new Squasher({});
        squasher.info('foo');
        squasher.debug('bar');
        squasher.warn('baz');
        squasher.slice(2);
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('baz');
        expect(logs[0].level).toEqual(Level.WARN);
    });
});

describe('Squasher.squash', () => {
    it('squashes the logs', () => {
        const squasher = new Squasher({ squashStr: '->' });
        squasher.info('hello', { squashable: true });
        squasher.info('first kept');
        squasher.info('foo', { squashable: true, squashIn: 'f' });
        squasher.info('bar', { squashable: true });
        squasher.info('baz', { squashable: true, squashIn: 'zab' });
        squasher.info('this is is kept');
        squasher.info('wut', { squashable: true });
        squasher.squash();
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(5);
        expect(logs[0].msg).toEqual('hello');
        expect(logs[1].msg).toEqual('first kept');
        expect(logs[2].msg).toEqual('f->bar->zab');
        expect(logs[3].msg).toEqual('this is is kept');
        expect(logs[4].msg).toEqual('wut');
    });

    it('prunes logs of given group', async () => {
        const squasher = new Squasher({ squashStr: '->' });
        await Promise.all([
            async function () {
                squasher.info('g1-hello', { group: 'g1', squashable: true });
                squasher.info('g1-first kept', { group: 'g1' });
                squasher.info('g1-foo', { group: 'g1', squashable: true, squashIn: 'f' });
                squasher.info('g1-bar', { group: 'g1', squashable: true });
                squasher.info('g1-baz', { group: 'g1', squashable: true, squashIn: 'zab' });
                squasher.info('g1-this is is kept', { group: 'g1' });
                squasher.info('g1-wut', { group: 'g1', squashable: true });
            }(),
            async function () {
                squasher.info('g2-hello', { group: 'g2', squashable: true });
                squasher.info('g2-first kept', { group: 'g2' });
                squasher.info('g2-foo', { group: 'g2', squashable: true, squashIn: 'g2-f' });
                squasher.info('g2-bar', { group: 'g2', squashable: true });
                squasher.info('g2-baz', { group: 'g2', squashable: true, squashIn: 'g2-zab' });
                squasher.info('g2-this is is kept', { group: 'g2' });
                squasher.info('g2-wut', { group: 'g2', squashable: true });
            }(),
        ]);
        squasher.squash('g2');
        const logs: Array<Log> = (squasher as any)._logs
            .filter((log: Log) => log.config.group === 'g2');
        expect(logs).toHaveLength(5);
        expect(logs[0].msg).toEqual('g2-hello');
        expect(logs[1].msg).toEqual('g2-first kept');
        expect(logs[2].msg).toEqual('g2-f->g2-bar->g2-zab');
        expect(logs[3].msg).toEqual('g2-this is is kept');
        expect(logs[4].msg).toEqual('g2-wut');
    });
});

describe('Squasher.output', () => {
    it('output the logs through logger', () => {
        console.debug = jest.fn(() => {/* NOOP */});
        console.info = jest.fn(() => {/* NOOP */});
        console.warn = jest.fn(() => {/* NOOP */});
        console.error = jest.fn(() => {/* NOOP */});

        const squasher = new Squasher({});
        squasher.debug('not even seen');
        squasher.info('foo', {}, 'some', 'other');
        squasher.warn('bar', {}, 'additional');
        squasher.error('baz', {}, 'loggable');
        squasher.output();

        expect(console.debug).not.toHaveBeenCalled();
        expect(console.info).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledWith('foo', 'some', 'other');
        expect(console.warn).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith('bar', 'additional');
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('baz', 'loggable');
    });

    it('output the given group logs through logger', async() => {
        console.debug = jest.fn(() => {/* NOOP */ });
        console.info = jest.fn(() => {/* NOOP */ });
        console.warn = jest.fn(() => {/* NOOP */ });
        console.error = jest.fn(() => {/* NOOP */ });

        const squasher = new Squasher({});

        await Promise.all([
            async function () {
                squasher.debug('g1-not even seen', { group: 'g1' });
                squasher.info('g1-foo', { group: 'g1' }, 'g1-some', 'g1-other');
                squasher.warn('g1-bar', { group: 'g1' }, 'g1-additional');
                squasher.error('g1-baz', { group: 'g1' }, 'g1-loggable');
            }(),
            async function () {
                squasher.debug('g2-not even seen', { group: 'g2' });
                squasher.info('g2-foo', { group: 'g2' }, 'g2-some', 'g2-other');
                squasher.warn('g2-bar', { group: 'g2' }, 'g2-additional');
                squasher.error('g2-baz', { group: 'g2' }, 'g2-loggable');
            }(),
        ]);

        squasher.output('g2');

        expect(console.debug).not.toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledTimes(1);
        expect(console.info).toHaveBeenCalledWith('g2-foo', 'g2-some', 'g2-other');
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith('g2-bar', 'g2-additional');
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('g2-baz', 'g2-loggable');
    });
});