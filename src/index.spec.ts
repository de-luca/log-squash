import Squasher, { Level, Log } from './index';

describe('Squasher.log', () => {
    it('adds a new log', () => {
        const squasher = new Squasher({});
        squasher.log('foo');
        const logs: Array<Log> = (squasher as any)._logs;
        expect(logs).toHaveLength(1);
        expect(logs[0].msg).toEqual('foo');
        expect(logs[0].level).toEqual(Level.INFO);
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
});