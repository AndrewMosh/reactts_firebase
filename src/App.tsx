import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodosAsync,
  selectTodos,
  selectStatus,
  addTodoAsync,
  toggleTodoAsync,
  removeTodoAsync,
} from "./features/todoSlice";
import { AppDispatch } from "./features/store";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectStatus);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch]);

  const handleAddTodo = (text: string) => {
    dispatch(addTodoAsync(text));
    setText("");
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodoAsync(id));
  };

  const handleRemoveTodo = (id: string) => {
    dispatch(removeTodoAsync(id));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "failed") {
    return <div>Error: {status}</div>;
  }
  return (
    <div>
      <h1>Todos</h1>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleAddTodo(text);
        }}
      >
        <input
          value={text}
          type="text"
          name="todoText"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
