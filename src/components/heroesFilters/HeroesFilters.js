import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import { activeFilterChanged, fetchFilters } from './filtersSlice';
import classNames from "classnames";

const HeroesFilters = () => {
    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        
        dispatch(fetchFilters())

        // eslint-disable-next-line 
    }, []);


    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if(arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }
        return arr.map(({name, label, className}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            })
            return <button
                    key={name}
                    id={name}
                    className={btnClass}
                    onClick={() => dispatch(activeFilterChanged(name))}>{label}</button>
        })
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFilters(filters)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;