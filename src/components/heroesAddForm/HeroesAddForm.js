import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {object, string} from 'yup';
import { useHttp } from '../../hooks/http.hook';
import { useSelector, useDispatch } from 'react-redux';
import { heroCreated, heroesFetched, heroesFetchingError } from '../../actions';
import {v4 as uuidv4} from 'uuid';
import './heroesAddForm.scss';

const validationSchema = object({
    name: string()
        .min(2, 'Too Short!')
        .max(12, 'Too Long!')
        .required('Required'),
    description: string().required('Required'),
    element: string().required('Required')

});

const HeroesAddForm = () => {
    const {request} = useHttp();
    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const [nameVal, setNameVal] = useState('');
    const [descrVal, setDescrVal] = useState('');
    const [elementVal, setElementVal] = useState('');

    const renderFilters = (filters, status) => {
        if(status === 'loading') {
            return <option>Загрузка элементов</option>
        }else if(status === 'error') {
            return <option>Ошибка загрузки</option>
        }
        if(filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                return (
                    <option key={name} value={name}>{label}</option>
                )
            })
        }
    }
    return (
        <Formik
            initialValues={{
                name: nameVal,
                description: descrVal,
                element: elementVal
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
                const newElem = {...values, id: uuidv4()};
                request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newElem))
                 .then(() => dispatch(heroCreated( newElem )))
                 .catch((e) => console.log(e))
                 .finally(() => { setNameVal(''); setDescrVal(''); setElementVal('')})
                
            }}
        >
            {({errors, touched}) => (
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field
                        onInput={e => setNameVal(e.target.value)}
                        value={nameVal}
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"/>
                    {errors.name && touched.name ? <div className='form-error'>{errors.name}</div> : null}
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-4">Описание</label>
                    <Field
                        as="textarea"
                        onInput={e => setDescrVal(e.target.value)}
                        value={descrVal}
                        name="description" 
                        className="form-control" 
                        id="description" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                        {errors.description && touched.description ? <div className='form-error'>{errors.description}</div> : null}
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        as="select" 
                        onInput={e => setElementVal(e.target.value)}
                        value={elementVal}
                        className="form-select" 
                        id="element" 
                        name="element">
                            {renderFilters(filters, filtersLoadingStatus)}
                    </Field>
                    {errors.element && touched.element ? <div className='form-error'>{errors.element}</div> : null}
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
            )
            }   
        </Formik>
        
    )
}

export default HeroesAddForm;