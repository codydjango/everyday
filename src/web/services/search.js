import MiniSearch from 'minisearch'

class Search {
    constructor() {
        this._docs = {}
        this.mini = new MiniSearch({
            fields: ['name', 'text'],
            searchOptions: {
                boost: { name: 2 },
                fuzzy: 0.6
            }
        })

        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
        this.update = this.update.bind(this)
    }

    addAll(docs) {
        // first remove all that exist already
        docs.forEach(doc => {
            if (this._docs[doc.id]) {
                this.mini.remove(this._docs[doc.id])
                delete this._docs[doc.id]
            }
        })

        // then add individually to seach index
        docs.forEach(this.add)
    }

    remove(doc) {
        try {
            if (this._docs[doc.id]) {
                this.mini.remove(this._docs[doc.id])
                delete this._docs[doc.id]
            }
        } catch (err) {
            console.log('error removing from search index', err)
        }
    }

    add(original) {
        if (original.id === 0) return

        const doc = {
            id: original.id,
            name: original.name,
            text: original.text
        }

        try {
            this._docs[doc.id] = doc
            this.mini.add(doc)
        } catch (err) {
            console.log('error adding to search index')
        }
    }

    update(original) {
        this.remove(original)
        this.add(original)
    }

    for(str) {
        return this.mini.search(str)
    }
}

export default new Search()
