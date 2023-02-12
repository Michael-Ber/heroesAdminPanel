import {useHttp} from '../../hooks/http.hook';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const [deleteItem, setDeleteItem] = useState({});
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);



    useEffect(() => {
        if(deleteItem.id) {
            request(`http://localhost:3001/heroes/${deleteItem.id}`, 'DELETE')
                .catch(() => dispatch(heroesFetchingError()))
        }
    }, [deleteItem])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }
        console.log(arr);
        return arr.filter(({id}) => id !== deleteItem.id)
                    .map(({id, ...props}) => {
            return <HeroesListItem key={id} setDeleteItem={setDeleteItem} id={id} {...props}/>
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;