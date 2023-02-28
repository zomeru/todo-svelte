<script lang='ts'>
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<button class:sm={size === 'sm'} class:md={size === 'md'} class:lg={size === 'lg'}>
<!-- <button class={`${size}`}> -->
  <slot>Button</slot>
</button>

<style lang="scss">
  @use '../styles/variable.scss' as variables;
  button {
    background-color: red;

    &.sm {
      padding: 0.5rem 1rem;
    }

    &.md {
      padding: 1rem 2rem;
    }

    &.lg {
      padding: 10px 15px;
    }

    &:hover {
      background-color: variables.$color;
    }
    
  }
</style>