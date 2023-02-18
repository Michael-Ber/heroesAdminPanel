import {useHttp} from '../../hooks/http.hook';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {createSelector} from 'reselect';
import { fetchHero } from '../../actions';
import { heroDeleted } from '../../components/heroesList/heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const filteredHeroesSelector = createSelector(
        state => state.filters.activeFilter,
        state => state.heroes.heroes,
        (filter, heroes) => {
            if(filter === 'all') {
                return heroes;
            }
            return heroes.filter(item => item.element === filter)
        }
    );
    const filteredHeroes = useSelector(filteredHeroesSelector);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        
        dispatch(fetchHero(request));
        

        // eslint-disable-next-line
    }, []);

    console.log(filteredHeroes)



    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then((data) => console.log(data, 'Deleted'))
            .then(() => dispatch(heroDeleted(id)))
            .catch((e) => console.log(e))
        
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={0} classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }
        return arr.map(({id, ...props}) => {
            return (
                
                    <CSSTransition 
                        key={id}
                        timeout={500}
                        classNames="hero">
                        <HeroesListItem {...props} onDelete={() => onDelete(id)}/>
                    </CSSTransition>
            )
        })
    }
    const elements = renderHeroesList(filteredHeroes);
    return (
        
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
        
    )
}

export default HeroesList;

