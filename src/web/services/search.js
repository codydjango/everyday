import MiniSearch from 'minisearch'

// const docs = [
//     { id: 1, title: 'Moby Dick', text: 'Call me Ishmael. Some years ago...' },
//     { id: 2, title: 'Zen and the Art of Motorcycle Maintenance', text: 'I can see by my watch...' },
//     { id: 3, title: 'Neuromancer', text: 'The sky above the port was...' },
//     { id: 4, title: 'Zen and the Art of Archery', text: 'At first sight it must seem...' }
// ]

class Search {
    constructor() {
        this.mini = new MiniSearch({ fields: ['name', 'markup'] })
    }

    add(doc) {
        this.mini.addAll(doc)
    }

    addAll(docs) {
        console.log('search addAll', docs)

        this.mini.addAll(docs)
    }

    for(str) {
        return this.mini.search(str)
    }
}

export default new Search()
