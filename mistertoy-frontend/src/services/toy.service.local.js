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
    console.log(filterBy)
    if (!filterBy.txt) filterBy.txt = ''
    if (!filterBy.maxPrice) filterBy.maxPrice = Infinity
    
    // if (filterBy.inStock === '') 
    const regExp = new RegExp(filterBy.txt, 'i')
    return storageService.query(STORAGE_KEY)
        .then(toys => {
            if(filterBy.labels.length) toys = toys.filter(toy => toy.labels.every(label => label.includes(filterBy.labels))) 
            if(filterBy.inStock !== '' ) toys = toys.filter(toy => toy.inStock === filterBy.inStock)
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
    return { txt: '', maxPrice: '', inStock: '', labels: [] }
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
    const toy = getEmptyToy(id, name, price, labels, createdAt, inStock);
    toy._id = utilService.makeId();
    toy.name = 'New Toy';
    toy.price = utilService.getRandomIntInclusive(10, 200);
    toy.labels = _getRandomLabels(); // Assign random labels
    toy.createdAt = Date.now();
    toy.inStock = Math.random() < 0.8 ? 'true' : 'false';
    return toy;
}

// Function to get random labels from the labels array
function _getRandomLabels() {
    const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
        'Outdoor', 'Battery Powered']
    const selectedLabels = []
    const numLabels = utilService.getRandomIntInclusive(1, 3) // Get 1 to 3 random labels
    const labelsCopy = [...labels]

    for (let i = 0; i < numLabels; i++) {
        const randIdx = utilService.getRandomIntInclusive(0, labelsCopy.length - 1)
        selectedLabels.push(labelsCopy[randIdx]);
        labelsCopy.splice(randIdx, 1); // Remove selected label to prevent duplicates
    }

    return selectedLabels
}