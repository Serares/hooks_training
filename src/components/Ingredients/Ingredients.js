import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from '../UI/ErrorModal';
import requestUrl from '../../request';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDER ELEMENTS");
  }, [ingredients]);

  const addIngredient = ingredient => {
    setIsLoading(true);
    fetch(requestUrl.url + '.jon', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
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
      if (ingredients.length > 0) {
        newIngredients = ingredients.filter(ing => ing.id !== ingId);
        setIngredients(newIngredients);
      }
    })

  };

  // se foloseste useCallback ca sa faca cache la functia filteredIngredients si sa nu se redefineasca cand se face re-render la functia ingredients cand este apelat setIngredients;

  const filterIngredients = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
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
          ingredients={ingredients}
          onRemoveItem={removeIngredient}
        />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
