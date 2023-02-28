<svelte:options immutable />

<script lang="ts">
	import TodoList from './lib/TodoList.svelte';
	import { v4 as uuid } from 'uuid';

	let todos = [
		{
			id: uuid(),
			title: 'Learn Svelte',
			done: true
		},
		{
			id: uuid(),
			title: 'Learn SvelteKit',
			done: false
		},
		{
			id: uuid(),
			title: 'Learn Go',
			done: false
		}
	];

	function handleAddTodo(event: CustomEvent) {
		event.preventDefault();
		todos = [...todos, { id: uuid(), title: event.detail.title, done: false }];
	}

	$: console.log('app', todos);
</script>

<TodoList {todos} on:addTodo={handleAddTodo} />

<style>
</style>
