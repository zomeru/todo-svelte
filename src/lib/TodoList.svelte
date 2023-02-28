<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Todo {
		id: string;
		title: string;
		done: boolean;
	}

	// Props
	export let todos: Todo[];

	// State
	let inputText = '';

	const dispatch = createEventDispatcher();

	function handleAddTodo() {
		const isNotCancelled = dispatch(
			'addTodo',
			{
				title: inputText
			},
			{ cancelable: true }
		);

		setTimeout(() => {
			if (isNotCancelled) {
				inputText = '';
				alert('Todo added!');
			}
		}, 300);
	}

	$: console.log('todo list', todos);
</script>

<h1>Todo list</h1>

<div class="todo-list-wrapper">
	<ul>
		{#each todos as { id, title, done }, index (id)}
			{@const number = index + 1}
			<li>
				{number} - {title}
				{#if done}
					<span>✅</span>
				{/if}
			</li>
		{/each}
	</ul>
	<form class="add-todo-form" on:submit|preventDefault={handleAddTodo}>
		<!-- <input type="text" bind:this={input} /> -->
		<input type="text" bind:value={inputText} />
		<button type="submit" disabled={!inputText}>Add</button>
	</form>
</div>
