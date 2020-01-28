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
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("should not get here");
  }

};

const httpReducer = (currentHttpState, action)=>{

  switch(action.type){
    case 'SEND':
      return {loading: true, error:null};
    case 'RESPONSE':
      return {...currentHttpState, loading: false};
    case 'ERROR':
      return {loading:false, error: action.errorData};
      case 'CLEAR':
      return {...currentHttpState ,error: null};
    default:
      throw new Error("should not be reached")
  }


}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading:false, error:null});

  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDER ELEMENTS");
  }, [userIngredients]);

  const addIngredient = ingredient => {
    dispatchHttp({type:'SEND'});
    fetch(requestUrl.url + '.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        dispatchHttp({type:"RESPONSE"});
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
        dispatchHttp({type:"ERROR", errorData:err.message});
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
    dispatchHttp({type:"CLEAR"});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={httpState.loading} />

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
