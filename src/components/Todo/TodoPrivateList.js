/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, Fragment } from "react";

import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";
// graphql queries
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
    clearInProgress: false
  });

  const filterResults = filter => {
    setState({
      ...state,
      filter: filter
    });
  };

  const clearCompleted = () => {};

  //let filteredTodos = state.todos;
  // eslint-disable-next-line react/prop-types
  const { todos } = props;
  let filteredTodos = todos;
  if (state.filter === "active") {
    filteredTodos = todos.filter(todo => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = todos.filter(todo => todo.is_completed === true);
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
// normally we use fetch to get the data and to make calls but here we will use useQuery hook to make a call 
//and get the data 
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

export default ToDoPrivateListQuery;
export { GET_MY_TODO };
