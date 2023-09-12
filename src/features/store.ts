import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todoSlice";

// Создание Redux Store
export const store = configureStore({
  reducer: {
    todos: todosReducer, // Подключение редьюсера, который вы создали ранее
    // Другие редьюсеры могут добавляться здесь, если у вас есть больше частей состояния
  },
  // Middleware (если необходимо)
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(yourMiddleware),
});

// Типы для работы с Thunk
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Экспорт store для использования в вашем приложении
export default store;
