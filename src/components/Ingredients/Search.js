import React, { useEffect, useState , useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { filterIngredients } = props;
  const [enteredFilter, setFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {

    const timer = setTimeout(() => {
      //use of closure aici , enteredFilter va avea valoarea de atunci cand s-a inceput setTimoutul sa se incarce
      if (enteredFilter === inputRef.current.value) {
        fetch("https://proiect-agenda.firebaseio.com/ingredients.json")
          .then(response => response.json())
          .then(responseData => {
            console.log(responseData);
            const loadedIngredients = [];
            for (let key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            };
            let filteredResult = loadedIngredients.filter(elem => { return elem.title.indexOf(enteredFilter) > -1 ? elem : null; });
            filterIngredients(filteredResult);
            console.log(filteredResult);
          });
      };
    }, 500);

    // poti sa returnezi o functie cu useEffect dar e optional,
    // si atunci cand returnezi trebuie sa fie o functie care va rula urmatoarea data inaite sa fie apelat useEffect
    // more memory efficient 
    return () =>{
      clearTimeout(timer);
    }
    // useEffect citeste si se apeleaza doar cand se modifica aceste dependente
  }, [enteredFilter, filterIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={(e) => { setFilter(e.target.value) }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
