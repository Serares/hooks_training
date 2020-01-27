import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log("RENDER ELEMENTS");
  }, [ingredients]);

  const addIngredient = ingredient => {
    fetch('https://proiect-agenda.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredient = (ingId, elem) => {
    let newIngredients = [];
    fetch(`https://proiect-agenda.firebaseio.com/ingredients/${ingId}.json`, {
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


  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient} />

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
