<svelte:options immutable />

<script lang="ts">
	import { createEventDispatcher, afterUpdate } from 'svelte';
	import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
	import { scale, crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Todo } from '../types';

	afterUpdate(() => {
		if (scrollOnAdd) {
			let pos = 0;
			if (scrollOnAdd === 'top') pos = 0;
			if (scrollOnAdd === 'bottom') pos = listDivOffsetHeight;
			if (autoScroll) listDiv.scrollTo(0, pos);
			autoScroll = false;
		}
	});

	const [send, receive] = crossfade({
		duration: 400,
		fallback(node) {
			return scale(node, { start: 0.5, duration: 300 });
		}
	});

	// Props
	export let todos: Todo[];
	export let isAddingTodo = false;
	export let loadingTodos = false;
	export let errorMsg = '';
	export let deletingItems: string[] = [];
	export let updatingItems: string[] = [];
	export let scrollOnAdd: 'top' | 'bottom' | undefined = undefined;

	$: done = todos ? todos.filter((todo) => todo.completed) : [];
	$: todo = todos ? todos.filter((todo) => !todo.completed) : [];

	let prevTodos = todos;

	// State & Events
	let inputText = '';
	let autoScroll = false;
	let input: HTMLInputElement;
	let listDiv: HTMLDivElement;
	let listDivOffsetHeight: number;

	$: {
		autoScroll = todos && prevTodos && prevTodos.length < todos.length;
		prevTodos = todos;
	}

	// Actions
	export function clearInput() {
		inputText = '';
	}
	export function focusInput() {
		input.focus();
	}

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

	function handleRemoveTodo(id: string) {
		dispatch('removeTodo', {
			id
		});
	}

	function handleToggleTodo(id: string, value: boolean) {
		dispatch('toggleTodo', {
			id,
			completed: value
		});
	}
</script>

<h1>Todo list</h1>

<div class="todo-list-wrapper">
	{#if loadingTodos}
		<p class="state-text">Loading...</p>
	{/if}
	{#if errorMsg}
		<p class="state-text">{errorMsg}</p>
	{/if}
	{#if todos}
		<div class="todo-list" bind:this={listDiv}>
			<div bind:offsetHeight={listDivOffsetHeight}>
				{#if todos.length === 0}
					<p class="state-text">No todos</p>
				{:else}
					<div style:display="flex">
						{#each [todo, done] as list, index}
							<div class="list-wrapper">
								<h2>{index === 0 ? 'Todo' : 'Done'}</h2>
								<ul>
									{#each list as todo, index (todo.id)}
										{@const { id, title, completed } = todo}
										<li
											animate:flip={{
												duration: 300
											}}
										>
											<slot {todo} {handleToggleTodo} {index}>
												<div
													in:receive|local={{
														key: id
													}}
													out:send|local={{
														key: id
													}}
													class:completed
												>
													<label>
														<input
															type="checkbox"
															checked={completed}
															on:change={() => handleToggleTodo(id, !completed)}
															disabled={deletingItems.includes(id) || updatingItems.includes(id)}
														/>
														<slot name="title">
															{title}
														</slot>
													</label>
													{#if deletingItems.includes(id)}
														<span class="deleting-text">Deleting</span>
													{/if}
													{#if updatingItems.includes(id)}
														<span class="updating-text">Updating</span>
													{/if}
													<button
														class="remove-todo-button"
														aria-label="Remove todo: {title}"
														on:click={() => handleRemoveTodo(id)}
														disabled={deletingItems.includes(id) || updatingItems.includes(id)}
													>
														<span style:width="10px" style:display="inline-block">
															<FaRegTrashAlt />
														</span></button
													>
												</div>
											</slot>
										</li>
									{/each}
									{#if isAddingTodo}
										<li>Loading...</li>
									{/if}
								</ul>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<form class="add-todo-form" on:submit|preventDefault={handleAddTodo}>
		<!-- <input type="text" bind:this={input} /> -->
		<input
			type="text"
			bind:value={inputText}
			bind:this={input}
			placeholder="New todo"
			disabled={isAddingTodo}
		/>
		<button type="submit" disabled={!inputText || isAddingTodo}>Add</button>
	</form>
</div>

<style lang="scss">
	.todo-list-wrapper {
		background-color: #424242;
		border: 1px solid #4b4b4b;

		.state-text {
			margin: 0;
			padding: 15px;
			text-align: center;
		}

		.add-todo-form {
			padding: 15px;
			background-color: #303030;
			display: flex;
			border-top: 1px solid #4b4b4b;

			input {
				flex: 1;
				background-color: #424242;
				border: 1px solid #4b4b4b;
				padding: 10px;
				color: #fff;
				border-radius: 5px;
				margin-right: 10px;
			}

			button {
				padding: 0 15px 0 15px;
				cursor: pointer;
				background-color: rgb(113, 167, 218);
				/* border: 1px solid #4b4b4b; */
				border: none;
				outline: none;
				border-radius: 5px;

				&:hover {
					background-color: rgb(148, 194, 236);
				}
			}
		}
	}
	.todo-list {
		max-height: 500px;
		overflow: auto;

		.list-wrapper {
			padding: 10px;
			flex: 1;

			h2 {
				margin-bottom: 10px;
			}
		}
		ul {
			margin: 0;
			padding: 10px;
			list-style: none;

			li > div {
				margin-bottom: 5px;
				display: flex;
				align-items: center;
				background-color: #303030;
				border-radius: 5px;
				padding: 10px;
				position: relative;

				.deleting-text {
					color: #bd1414;
					font-size: 12px;
					position: absolute;
					right: 30px;
				}

				.updating-text {
					color: #73afe0;
					font-size: 12px;
					position: absolute;
					right: 30px;
				}

				label {
					cursor: pointer;
					font-size: 18px;
					display: flex;
					align-items: baseline;
					padding-right: 20px;

					input[type='checkbox'] {
						margin: 0 10px 0 0;
						cursor: pointer;
					}
				}
				&.completed > label {
					opacity: 0.5;
					text-decoration: line-through;
				}

				.remove-todo-button {
					border: none;
					background: none;
					padding: 5px;
					position: absolute;
					right: 10px;
					cursor: pointer;
					display: none;
					:global(svg) {
						fill: #bd1414;
					}
				}

				&:hover {
					.remove-todo-button {
						display: block;
					}
				}
			}
		}
	}
</style>
