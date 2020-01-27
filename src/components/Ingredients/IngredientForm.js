import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo(props => {
  //const [inputState, setInputsState] = useState({ title: "", amount: "" });
  const [inputTitle, changeInputTitle] = useState("");
  const [inputAmount, changeInputAmount] = useState("");

  const submitHandler = event => {
    event.preventDefault();
    // ...
    props.onAddIngredient({ title: inputTitle, amount: inputAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputTitle}
              onChange={event => {
                changeInputTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputAmount}
              onChange={event => {
                changeInputAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;