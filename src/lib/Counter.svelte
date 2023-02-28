<script lang="ts">
  export let count: number;
  export let count2: number;

  console.log($$props, $$restProps, $$slots)


  $: str = `Clicked ${count} ${count === 1 ? 'time' : 'times'}`
  $: str2 = `Clicked ${count2} ${count2 === 1 ? 'time' : 'times'}`
  $: total = getTotal(count, count2)
  // $: total = `${count + count2}`

  function increment() {
    count += 1;
  }

  function increment2() {
    count2 += 1;
  }

  function getTotal(c1: number, c2: number) {
    return c1 + c2;
  }

</script>

<div>
  <button on:click={increment}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
  </button>
  <button on:click={increment2}>
    Clicked {count2} {count2 === 1 ? 'time' : 'times'}
  </button>
  <h1>{str}</h1>
  <h1>{str2}</h1>
  <h1>Total is {total}</h1>
</div>