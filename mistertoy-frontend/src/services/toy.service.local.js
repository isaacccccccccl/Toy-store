import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

const STORAGE_KEY = 'toyDB'
_createToys()

export const toyService = {
    query,
    getById,
    remove,
    save,
    getEmptyToy,
    getRandomToy,
    getDefaultFilter
}

function query(filterBy = {}) {
    if (!filterBy.txt) filterBy.txt = ''
    if (!filterBy.maxPrice) filterBy.maxPrice = Infinity
    const regExp = new RegExp(filterBy.txt, 'i')
    return storageService.query(STORAGE_KEY)
        .then(toys => {
            return toys.filter(toy => 
                regExp.test(toy.name) && 
                toy.price <= filterBy.maxPrice
            )
        })
}

function getById(toyId) {
    return storageService.get(STORAGE_KEY, toyId)
}

function remove(toyId) {
    return storageService.remove(STORAGE_KEY, toyId)
}

function save(toy) {
    if (toy._id) {
        return storageService.put(STORAGE_KEY, toy)
    } else {
        toy._id = utilService.makeId()
        return storageService.post(STORAGE_KEY, toy)
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: '',
    }
}

function getRandomToy() {
    return {
        name: 'Baz-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '' }
}

function _createToys() {
    let toys = utilService.loadFromStorage(STORAGE_KEY)
    if (!toys || !toys.length) {
        toys = []
        for (let i = 0; i < 20; i++) {
            const toy = _createToy()
            toys.push(toy)
        }
        _createToy()
    }
    utilService.saveToStorage(STORAGE_KEY, toys)
}
function _createToy(id, name, price, labels, createdAt, inStock) {
    const toy = getEmptyToy(id, name, price, labels, createdAt, inStock)
    toy._id = utilService.makeId()
    toy.name = 'New Toy'
    toy.price = utilService.getRandomIntInclusive(10, 200)
    toy.labels = []
    toy.createdAt = Date.now()
    toy.inStock = Math.random() < 0.8
    return toy
}