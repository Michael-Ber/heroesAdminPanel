import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHttp } from "../../hooks/http.hook";
import { heroesFetching, heroesFetched, heroesFetchingError, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {filters, heroes} = useSelector(state => state);
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('all');
    const {request} = useHttp();

    const filterItems = (filter) => {
        return heroes.filter(item => item.element === filter)
    }


    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    <button 
                        onClick={e => setFilter(e.target.dataset.value)}
                        data-value={filters.length > 0 && Object.keys(filters[0])} 
                        className="btn btn-outline-dark active">Все</button>
                    <button 
                        onClick={e => setFilter(e.target.dataset.value)}
                        data-value={filters.length > 0 && Object.keys(filters[1])} 
                        className="btn btn-danger">Огонь</button>
                    <button 
                        onClick={e => setFilter(e.target.dataset.value)} 
                        data-value={filters.length > 0 && Object.keys(filters[2])}
                        className="btn btn-primary">Вода</button>
                    <button 
                        onClick={e => setFilter(e.target.dataset.value)} 
                        data-value={filters.length > 0 && Object.keys(filters[3])}
                        className="btn btn-success">Ветер</button>
                    <button 
                        onClick={e => setFilter(e.target.dataset.value)} 
                        data-value={filters.length > 0 && Object.keys(filters[4])}
                        className="btn btn-secondary">Земля</button>
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;