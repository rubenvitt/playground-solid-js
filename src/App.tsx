import type { Component } from "solid-js";
import {
  createEffect,
  createMemo,
  createSignal,
  ErrorBoundary,
  For,
  Index,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import styles from "./App.module.css";
import { Dynamic } from "solid-js/web";
import { Broken } from "./Broken";

function fibonacci(num: number): number {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

const RedThing = () => <strong style="color: red">Red Thing</strong>;
const GreenThing = () => <strong style="color: green">Green Thing</strong>;
const BlueThing = () => <strong style="color: blue">Blue Thing</strong>;

const options = {
  red: RedThing,
  green: GreenThing,
  blue: BlueThing,
};

interface Photo {
  thumbnailUrl: string;
  title: string;
}

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const [count1, setCount1] = createSignal(0);

  const fib = createMemo(() => {
    console.log("calc fib for", count());
    return fibonacci(count());
  });

  const doubleCount = () => count() * 2;

  createEffect(() => {
    console.log("fib is", fib());
  });

  createEffect(() => {
    console.log("alternative count is", count1());
  });

  const [signedIn, setSignedIn] = createSignal(false);
  const toggleSignedIn = () => setSignedIn((prev) => !prev);

  const [cats, setCats] = createSignal([
    { id: "J---aiyznGQ", name: "Keyboard Cat" },
    { id: "z_AbfPXTKms", name: "Maru" },
    { id: "OUtn3pvWmpg", name: "Henri The Existential Cat" },
  ]);

  const [selectedThing, setSelectedThing] = createSignal<
    "red" | "green" | "blue"
  >("red");

  const [photos, setPhotos] = createSignal<Photo[]>([]);
  onMount(async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/photos?_limit=20"
    );
    setPhotos(await res.json());
  });

  return (
    <div class={styles.App}>
      <ErrorBoundary fallback={(err: Error) => err.message}>
        <Broken />
      </ErrorBoundary>

      <section class={styles.header}>
        <section id="lifecycle">
          <For each={photos()} fallback={<p>Loading</p>}>
            {(photo) => (
              <figure>
                <img src={photo.thumbnailUrl} alt={photo.title} />
                <figcaption>{photo.title}</figcaption>
              </figure>
            )}
          </For>
        </section>

        <section id="flow">
          <Show
            when={signedIn()}
            fallback={<button onclick={toggleSignedIn}>Sign in</button>}
          >
            <button onclick={toggleSignedIn}>Sign out</button>
          </Show>

          <ul class={styles.list}>
            <For each={cats()}>
              {(cat, i) => (
                <li>
                  <a
                    style={{ color: "white" }}
                    href={`https://youtube.com/watch?v=${cat.id}`}
                  >
                    {i() + 1}: {cat.name}
                  </a>
                </li>
              )}
            </For>
            <Index each={cats()}>
              {(cat, i) => (
                <li>
                  <a
                    style={{ color: "white" }}
                    href={`https://youtube.com/watch?v=${cat().id}`}
                  >
                    {i + 1}: {cat().name}
                  </a>
                </li>
              )}
            </Index>
          </ul>

          <Switch fallback={<p>{count()} is not dividable by either 5 or 2</p>}>
            <Match when={count() % 5 === 0}>
              <p>{count()} is dividable by 5</p>
            </Match>
            <Match when={count() % 2 === 0}>
              <p>{count()} is dividable by 2</p>
            </Match>
          </Switch>

          <select
            value={selectedThing()}
            oninput={(e) =>
              setSelectedThing(
                e.currentTarget.value as "red" | "green" | "blue"
              )
            }
          >
            <For each={Object.keys(options)}>
              {(color) => <option value={color}>{color}</option>}
            </For>
          </select>
          <Dynamic component={options[selectedThing()]} />
        </section>

        <section id="general">
          <p>Das ist mein Counter: {count()}</p>
          <p>Das ist mein doppelter Counter: {doubleCount()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <p>Das ist meine fib: {fib()}</p>
          <button onclick={() => setCount((prev) => prev + 1)}>
            Increase value
          </button>
          <p>Das ist mein alternativer Counter: {count1()}</p>
          <button onclick={() => setCount1((prev) => prev + 1)}>
            Increase alternative value
          </button>
        </section>
      </section>
    </div>
  );
};

export default App;
