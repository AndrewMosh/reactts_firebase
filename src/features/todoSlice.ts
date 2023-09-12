import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { RootState } from "./store";

import db from "../firebase.config";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: "idle",
  error: null,
};

export const fetchTodosAsync = createAsyncThunk(
  "todos/fetchTodosAsync",
  async () => {
    const todosCollection = collection(db, "todos");
    const querySnapshot = await getDocs(todosCollection);
    const todos: Todo[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      todos.push({ ...(data as Todo), id: doc.id });
    });

    return todos;
  }
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (text: string) => {
    const todoCollection = collection(db, "todos");
    const docRef = await addDoc(todoCollection, {
      text,
      completed: false,
    });

    return { id: docRef.id, text, completed: false };
  }
);

export const toggleTodoAsync = createAsyncThunk(
  "todos/toggleTodoAsync",
  async (id: string) => {
    const todoDoc = doc(db, "todos", id);
    const docSnapshot = await getDoc(todoDoc);

    if (docSnapshot.exists()) {
      const todoData = docSnapshot.data();
      if (typeof todoData?.completed === "boolean") {
        await updateDoc(todoDoc, {
          completed: !todoData.completed,
        });

        return { id, completed: !todoData.completed };
      }
    }

    throw new Error("Todo does not exist or has an invalid format.");
  }
);

export const removeTodoAsync = createAsyncThunk(
  "todos/removeTodoAsync",
  async (id: string) => {
    const todoDoc = doc(db, "todos", id);
    const docSnapshot = await getDoc(todoDoc);

    if (docSnapshot.exists()) {
      await deleteDoc(todoDoc);

      return id;
    }

    throw new Error("Todo does not exist.");
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const { id, completed } = action.payload;
        const todoIndex = state.todos.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
          state.todos[todoIndex].completed = completed;
        }
      })
      .addCase(removeTodoAsync.fulfilled, (state, action) => {
        const removedTodoId = action.payload;
        state.todos = state.todos.filter((todo) => todo.id !== removedTodoId);
      });
  },
});

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectStatus = (state: RootState) => state.todos.status;
export const selectError = (state: RootState) => state.todos.error;

export default todosSlice.reducer;
