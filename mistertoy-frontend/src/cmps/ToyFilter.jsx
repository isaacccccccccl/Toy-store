
import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service.js"


export function ToyFilter({ filterBy, onSetFilter }) {
    // console.log('filter by', filterBy)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 300))
    
    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])
    
    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        if (field === "labels") {
            const selectedOptions = Array.from(target.selectedOptions, option => option.value)
            setFilterByToEdit((prevFilter) => ({ ...prevFilter, labels: selectedOptions }))
        } else {
            setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
        }
        // setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }
    
    // console.log(filterByToEdit)
    return (
        <section className="toy-filter full main-layout">
            <h2>Toys Filter</h2>
            <form >
                <label htmlFor="name">name:</label>
                <input type="text"
                    id="name"
                    name="txt"
                    placeholder="By name"
                    value={filterByToEdit.txt}
                    onChange={handleChange}
                    />

                <label htmlFor="maxPrice">Max price:</label>
                <input type="number"
                    id="maxPrice"
                    name="maxPrice"
                    placeholder="By max price"
                    value={filterByToEdit.maxPrice || ''}
                    onChange={handleChange}
                />

                <label htmlFor="inStock">In Stock</label>
                <select name="inStock" id="inStock" onChange={handleChange}>
                    <option value="">All</option>
                    <option value="false">Not in stock</option>
                    <option value="true">in stock</option>
                </select>

                <label htmlFor="labels">Toy Labels:</label>
                <select 
                    id="labels" 
                    name="labels" 
                    multiple
                    value={filterByToEdit.labels || []} 
                    onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        setFilterByToEdit((prevFilter) => ({ ...prevFilter, labels: selectedOptions }));
                    }}
                >
                    {['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'].map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>

            </form>

        </section>
    )
}