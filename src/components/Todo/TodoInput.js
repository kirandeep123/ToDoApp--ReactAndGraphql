/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { GET_MY_TODO } from "./TodoPrivateList";
// eslint-disable-next-line prettier/prettier
import { useState } from "react";
import gql from "graphql-tag";
const INSERT_TODO = gql`
  mutation($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;
const TodoInput = ({ isPublic = false }) => {
  // eslint-disable-next-line prettier/prettier
  let input;
  const [todoInput, setToDoInput] = useState("");
  const updateCache = (cache, { data }) => {
    if (isPublic) {
      return null;
    }
    const existingTodos = cache.readQuery({ query: GET_MY_TODO });
    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({
      query: GET_MY_TODO,
      data: { todos: [newTodo, ...existingTodos] }
    });
  };
  const resetInput = () => {
    setToDoInput("");
  };
  const [addToDo] = useMutation(INSERT_TODO, {
    update: updateCache,
    onCompleted: resetInput
  });
  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addToDo({ variables: { todo: todoInput, isPublic } });
      }}
    >
      <input
        className="input"
        placeholder="What needs to be done?"
        value={todoInput}
        onChange={e => setToDoInput(e.target.value)}
        ref={n => (input = n)}
      />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
