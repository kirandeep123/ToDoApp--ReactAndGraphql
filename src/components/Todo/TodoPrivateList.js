/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, Fragment } from "react";

import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";
const GET_MY_TODO = gql`
  query getMyTodos {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
      is_completed
    }
  }
`;
const TodoPrivateList = props => {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false,
    todos: [
      {
        id: "1",
        title: "This is private todo 1",
        is_completed: true,
        is_public: false
      },
      {
        id: "2",
        title: "This is private todo 2",
        is_completed: false,
        is_public: false
      }
    ]
  });

  const filterResults = filter => {
    setState({
      ...state,
      filter: filter
    });
  };

  const clearCompleted = () => {};

  let filteredTodos = state.todos;
  if (state.filter === "active") {
    filteredTodos = state.todos.filter(todo => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = state.todos.filter(todo => todo.is_completed === true);
  }

  const todoList = [];
  filteredTodos.forEach((todo, index) => {
    todoList.push(<TodoItem key={index} index={index} todo={todo} />);
  });

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={state.filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
        clearInProgress={state.clearInProgress}
      />
    </Fragment>
  );
};
const ToDoPrivateListQuery = () => {
  const { loading, error, data } = useQuery(GET_MY_TODO);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>error</div>;
  }
  return <TodoPrivateList todos={data.todos} />;
};

export default TodoPrivateList;
