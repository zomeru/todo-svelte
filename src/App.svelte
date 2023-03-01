<svelte:options immutable />

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { v4 as uuid } from 'uuid';

	import TodoList from './lib/TodoList.svelte';
	import { Todo } from './types';
	import spin from './lib/transitions/spin';
	import fade from './lib/transitions/fade';
	// import Sample from './lib/Sample.svelte';

	let todoList: {
		clearInput: () => void;
		focusInput: () => void;
	};

	const URL = 'https://jsonplaceholder.typicode.com/todos' as const;

	let isAddingTodo = false;
	let loadingTodos = false;
	let todoHidden = false;
	let errorMsg = '';
	let todos: Todo[] = null as unknown as Todo[];
	let updatingItems: string[] = [];
	let deletingItems: string[] = [];

	onMount(() => {
		loadTodos();
	});

	function loadTodos() {
		loadingTodos = true;

		fetch(`${URL}?_limit=10`)
			.then(async (res) => {
				if (res.ok) {
					todos = await res.json();
				} else {
					errorMsg = 'Failed to load todos';
				}
			})
			.catch((err) => {
				errorMsg = 'Failed to load todos';
			})
			.finally(() => {
				loadingTodos = false;
			});
	}

	async function handleAddTodo(event: CustomEvent) {
		event.preventDefault();

		if (isAddingTodo) {
			alert('Please wait...');
			return;
		}

		isAddingTodo = true;

		fetch(URL, {
			method: 'POST',
			body: JSON.stringify({
				title: event.detail.title,
				completed: false
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then(async (res) => {
				if (res.ok) {
					const todo = await res.json();
					todos = [{ ...todo, id: uuid() }, ...todos];
					todoList.clearInput();
				} else {
					errorMsg = 'Failed to add todo';
				}
			})
			.finally(async () => {
				isAddingTodo = false;

				await tick();
				todoList.focusInput();
			});
	}

	function handleRemoveTodo(event: CustomEvent) {
		const id = event.detail.id;
		if (deletingItems.includes(id)) return;

		deletingItems = [...deletingItems, id];

		fetch(`${URL}/${id}`, {
			method: 'DELETE'
		})
			.then((res) => {
				if (res.ok) {
					todos = todos.filter((todo) => todo.id !== event.detail.id);
				} else {
					errorMsg = 'Failed to remove todo';
				}
			})
			.catch((err) => {
				errorMsg = 'Failed to remove todo';
			})
			.finally(() => {
				deletingItems = deletingItems.filter((item) => item !== id);
			});
	}

	function handleToggleTodo(event: CustomEvent) {
		const id = event.detail.id;

		if (updatingItems.includes(id)) return;

		updatingItems = [...updatingItems, id];

		const value = event.detail.completed;

		console.log('value', value);

		fetch(`${URL}/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				completed: value
			})
		})
			.then(async (res) => {
				if (res.ok) {
					const updatedTodo = await res.json();
					todos = todos.map((todo) =>
						todo.id === id ? { ...updatedTodo, completed: value } : todo
					);
				} else {
					errorMsg = 'Failed to toggle todo';
				}
			})
			.catch((err) => {
				errorMsg = 'Failed to toggle todo';
			})
			.finally(() => {
				updatingItems = updatingItems.filter((item) => item !== id);
			});
	}
</script>

<button
	on:click={() => {
		todoHidden = !todoHidden;
	}}>Hide/Show todo</button
>

{#if !todoHidden}
	<div style:max-width="800px">
		<TodoList
			{todos}
			{isAddingTodo}
			{loadingTodos}
			{errorMsg}
			{updatingItems}
			{deletingItems}
			scrollOnAdd="top"
			bind:this={todoList}
			on:addTodo={handleAddTodo}
			on:removeTodo={handleRemoveTodo}
			on:toggleTodo={handleToggleTodo}
		/>
		<!-- <span slot="title">{index + 1}: {todo.title}</span> -->
		<!-- <div>
				<input
					type="checkbox"
					checked={completed}
					on:change={() => handleToggleTodo(id, !completed)}
					disabled={deletingItems.includes(id) || updatingItems.includes(id)}
				/>
				{title}
			</div> -->
		<!-- <Todo {todo}  /> -->
		<!-- </TodoList> -->
	</div>
	{#if todos}
		<p>
			Number of todos:
			{#key todos.length}
				<span
					style:display="inline-block"
					in:fly|local={{
						y: -10
					}}>{todos.length}</span
				>
			{/key}
		</p>
	{/if}
{/if}

<!-- <Sample /> -->

<!-- 
<button on:click={() => todoList.focusInput()}>Focus input</button>
-->
<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		background-color: #242424;
		color: white;
	}
</style>
