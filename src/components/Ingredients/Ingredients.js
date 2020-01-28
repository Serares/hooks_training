import React, { useReducer, useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from '../UI/ErrorModal';
import requestUrl from '../../request';

const ingredientReducer = (currentIngredients, action) => {

  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error("should not get here");
  }

}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDER ELEMENTS");
  }, [ingredients]);

  const addIngredient = ingredient => {
    setIsLoading(true);
    fetch(requestUrl.url + '.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        // setIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({ type: "ADD", ingredient: { id: responseData.name, ...ingredient } })
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const removeIngredient = (ingId, elem) => {
    let newIngredients = [];
    fetch(`${requestUrl.url}/${ingId}.json`, {
      method: 'DELETE'
    }).then(response => {
      // if (ingredients.length > 0) {
      //   newIngredients = ingredients.filter(ing => ing.id !== ingId);
      //   setIngredients(newIngredients);
      // }
      dispatch({ type: "DELETE", id: ingId })
    })

  };

  // se foloseste useCallback ca sa faca cache la functia filteredIngredients si sa nu se redefineasca cand se face re-render la functia ingredients cand este apelat setIngredients;

  const filterIngredients = useCallback(filteredIngredients => {
    // setIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={isLoading} />

      <section>
        <Search filterIngredients={filterIngredients} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredient}
        />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
