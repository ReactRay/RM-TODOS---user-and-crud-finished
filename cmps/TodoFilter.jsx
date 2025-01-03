const { useState, useEffect, useRef } = React
import { utilService } from "../services/util.service.js"

const { useSelector, useDispatch } = ReactRedux

export function TodoFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
    const debouncedSetFilter = useRef(utilService.debounce(onSetFilterBy)).current;
    const formStyle = useSelector(state => state.userModule.pref)

    useEffect(() => {
        debouncedSetFilter(filterByToEdit);
    }, [filterByToEdit]);

    function handleChange({ target }) {
        const field = target.name;
        let value = target.value;

        switch (target.type) {
            case "number":
            case "range":
                value = +value || "";
                break;
            case "checkbox":
                value = target.checked;
                break;
            case "select-one":
                value = value === "" ? "" : value === "true";
                break;
            default:
                break;
        }
        console.log('handle change activated')
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
    }

    function onSubmitFilter(ev) {
        ev.preventDefault();
        setFilterByToEdit(filterBy); // Trigger manual filtering
    }

    const { txt = "", importance = "", isDone = "", sorted = false } = filterByToEdit;

    return (
        <section className="todo-filter boxshadow" style={formStyle}>
            <h2>Filter Todos 📁</h2>
            <form onSubmit={onSubmitFilter}>
                <input
                    value={txt}
                    onChange={handleChange}
                    type="search"
                    placeholder="By Txt"
                    id="txt"
                    name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input
                    value={importance}
                    onChange={handleChange}
                    type="number"
                    placeholder="By Importance"
                    id="importance"
                    name="importance"
                />
                <label htmlFor="status">Status: </label>
                <select
                    name="isDone"
                    value={isDone}
                    onChange={handleChange}
                >
                    <option value="">All</option>
                    <option value="true">Completed</option>
                    <option value="false">In Progress</option>
                </select>
                <label >  sort by importance</label>
                <input type="checkbox" value={sorted} id="sorted" name="sorted" onChange={handleChange} />
                <button hidden>Set Filter</button>
            </form>
        </section>
    );
}