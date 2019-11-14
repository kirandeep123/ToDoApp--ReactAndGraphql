/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import gql from "graphql-tag";
import { GET_MY_TODO } from "./TodoPrivateList";
// eslint-disable-next-line prettier/prettier
import { useMutation } from "@apollo/react-hooks";

const TOGGLE_TODO = gql`
  mutation($id: Int!, $isCompleted: Boolean!) {
    update_todos(
      where: { id: { _eq: $id } }
      _set: { is_completed: $isCompleted }
    ) {
      affected_rows
    }
  }
`;

const REMOVE_TODO = gql`
  mutation($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
const TodoItem = ({ index, todo }) => {
  const [toggleToDoMutation] = useMutation(TOGGLE_TODO);
  const [removeToDoMutation] = useMutation(REMOVE_TODO);

  const removeTodo = e => {
    e.preventDefault();
    e.stopPropagation();
    removeToDoMutation({
      variables: { id: todo.id },
      optimisticResponse: null,
      update: cache => {
        const existingTodos = cache.readQuery({ query: GET_MY_TODO });
        const updatedToDos = existingTodos.todos.filter(t => t.id !== todo.id);
        cache.writeQuery({ query: GET_MY_TODO, data: { todos: updatedToDos } });
      }
    });
  };

  const toggleTodo = () => {
    toggleToDoMutation({
      variables: { id: todo.id, isCompleted: !todo.is_completed },
      optimisticResponse: null,
      update: (cache, { data }) => {
        const existingTodos = cache.readQuery({ query: GET_MY_TODO });
        const newTodos = existingTodos.todos.map(t => {
          if (t.id === todo.id) {
            return { ...t, isCompleted: !t.is_completed };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: GET_MY_TODO,
          data: { todos: newTodos }
        });
      }
    });
  };

  return (
    <li>
      <div className="view">
        <div className="round">
          <input
            checked={todo.is_completed}
            type="checkbox"
            id={todo.id}
            onChange={toggleTodo}
          />
          <label htmlFor={todo.id} />
        </div>
      </div>

      <div className={"labelContent" + (todo.is_completed ? " completed" : "")}>
        <div>{todo.title}</div>
      </div>

      <button className="closeBtn" onClick={removeTodo}>
        x
      </button>
    </li>
  );
};

export default TodoItem;
