import { useIsFetching } from "@tanstack/react-query";
import { useTodoIds, useTodos } from "../services/queries";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutation";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Todo } from "../types/todo";

export default function Todo() {
  const { data, fetchStatus, status } = useTodoIds();
  const isFetching = useIsFetching();
  const todosQueries = useTodos(data);

  const { register, handleSubmit } = useForm<Todo>();

  const createTodoMutattion = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const delteTodoMutation = useDeleteTodo();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutattion.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) updateTodoMutation.mutate({ ...data, checked: true });
  };
  const handleDeleteTodo = (id: number|undefined) => {
    if (id) delteTodoMutation.mutate(id);
  };

  //   if (isPending) {
  //     return <span>loading......</span>;
  //   }
  //   if (isError) {
  //     return <span>error</span>;
  //   }

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h2>New todo</h2>
        <input type="text" placeholder="Title" {...register("title")} />
        <br />
        <input
          type="text"
          placeholder="description"
          {...register("description")}
        />
        <input type="submit" disabled={createTodoMutattion.isPending} />
      </form>
      {/* <p>Query function status is {fetchStatus}</p>
      <p>Query data status is {status}</p>
      <p>Global is Fetching {isFetching}</p>
      {data?.map((todo) => (
        <p key={todo}>{todo}</p>
      ))} */}

      <ul>
        {todosQueries.map((query) => (
          <li key={query.data?.id}>
            <span>{query.data?.title}</span>
            <span>{query.data?.description}</span>
            <span>{query.data?.checked}</span>
            <button
              onClick={() => handleMarkAsDoneSubmit(query.data)}
              disabled={query.data?.checked}
            >
              {query.data?.checked ? "done" : "Mark as done"}
            </button>
            <button
              onClick={() => handleDeleteTodo(query.data?.id)}
              style={{ backgroundColor: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
