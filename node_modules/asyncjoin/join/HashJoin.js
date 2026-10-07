
let AsyncIterator = require('asynciterator').AsyncIterator;

// https://en.wikipedia.org/wiki/Hash_join
class HashJoin extends AsyncIterator
{
    constructor (left, right, funHash, funJoin)
    {
        super();

        this.addedDataListener = false;
        this.left = left;
        this.right = right;
        this.funHash = funHash;
        this.funJoin = funJoin;

        this.leftMap = new Map();
        this.rightUnused = false;

        this.match    = null;
        this.matches  = [];
        this.matchIdx = 0;

        this.left.on('error', (error) => this.destroy(error));
        this.right.on('error', (error) => this.destroy(error));

        this.readable = false;

        this.left.on('end', allowJoining.bind(this));

        function allowJoining ()
        {
            this.readable = true;

            // An inner join over an empty hash table produces nothing, so the right stream never has to be read.
            // Reading it is cheap for an in-memory iterator, but not for one backed by a remote source.
            // The iterator is ended from `read` rather than here, because `_end` notifies the listeners that
            // are attached at that moment and then drops them, and a consumer may not have attached any yet.
            if (this.leftMap.size === 0)
            {
                this.rightUnused = true;
                return;
            }

            this.right.on('readable', () => this.readable = true);
            this.right.on('end', () => { if (!this.hasResults()) this._end(); });
        }

        this.on('newListener', (eventName) =>
        {
            if (eventName === 'data')
            {
                this._addDataListenerIfNeeded();
            }
        });
        if (this.left.readable)
            this._addDataListenerIfNeeded();
        this.left.on('readable', () => this._addDataListenerIfNeeded());
    }

    hasResults ()
    {
        return !this.right.ended || this.matchIdx < this.matches.length;
    }

    _end ()
    {
        super._end();
        this.left.destroy();
        this.right.destroy();
    }

    read ()
    {
        this._addDataListenerIfNeeded();

        while(true) {
            if (this.ended || !this.readable)
                return null;

            if (this.rightUnused)
            {
                this._end();
                return null;
            }

            while (this.matchIdx < this.matches.length)
            {
                let item = this.matches[this.matchIdx++];
                let result = this.funJoin(item, this.match);
                if (result !== null)
                    return result;
            }

            if (!this.hasResults())
                this._end();

            this.match = this.right.read();

            if (this.match === null)
            {
                this.readable = false;
                return null;
            }

            let hash = this.funHash(this.match);
            this.matches = this.leftMap.get(hash) || [];
            this.matchIdx = 0;
        }
    }

    _addDataListenerIfNeeded() {
        if (!this.addedDataListener)
        {
            this.addedDataListener = true;
            this._addDataListener();
        }
    }

    _addDataListener()
    {
        this.left.on('data', addItem.bind(this));

        function addItem(item)
        {
            let hash = this.funHash(item);
            let arr = this.leftMap.get(hash);
            if (!arr) {
                arr = [];
                this.leftMap.set(hash, arr);
            }
            arr.push(item);
        }
    }
}

module.exports = HashJoin;
