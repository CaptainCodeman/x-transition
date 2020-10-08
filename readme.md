# x-transition

A Web Component for adding animated transition effects by swapping CSS classes. Useful if you want to use Tailwind CSS / Tailwind UI with something _other_ than Alpine.js, Vue or React (e.g. lit-element / lit-html or Vanilla JavaScript).

Automatically handles nested transitions so parent isn't hidden until child transitions have completed.

702 bytes Brotli, 877 bytes Gzipped, 2.28 KB Minified.

[demo](https://x-transition.web.app/)

## Usage

Wrap the element to transition with `<x-transition>` and set the `open` attribute or `.open` property to control visibility. Define the classes to apply using the attributes:

* `enter` Applied when the element is being shown (enter transition)
* `enter-from` Applied at the start of the enter transition
* `enter-to` Applied at the end of the enter transition
* `leave` Applied when the element is being hidden (leave transition)
* `leave-from` Applied at the start of the leave transition
* `leave-to` Applied at the end of the leave transition

After enter, the elements `style.display` property is cleared.
After leave, the elements `style.display` property is set to `none`.

If the enter & leave transitions are symmetrical, a more compact definition can be used:

* `with` Will apply the same values to `enter` and `leave`.
* `show` Will apply the same values to `enter-to` and `leave-from` (i.e. the showing state).
* `hide` Will apply the same values to `enter-from` and `leave-to` (i.e. the hiding state).

### CDN / Static HTML / Vanilla JS

Add the script to the page:

```html
<script src="https://unpkg.com/@captaincodeman/transition?module" type="module"></script>
```

Wrap elements to transition with `<x-transition>` element using Tailwind CSS suggested classes:

```html
<!--
  Off-canvas menu overlay, show/hide based on off-canvas menu state.

  Entering: "transition-opacity ease-linear duration-300"
    From: "opacity-0"
    To: "opacity-100"
  Leaving: "transition-opacity ease-linear duration-300"
    From: "opacity-100"
    To: "opacity-0"
-->
<x-transition
    id="overlay"
    enter="transition-opacity ease-linear duration-300"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity ease-linear duration-300"
    leave-from="opacity-100"
    leave-to="opacity-0">
  <div class="fixed inset-0">
    <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
  </div>
</x-transition>
```

Or, alternatively, using the shortened form:

```html
<x-transition 
    id="overlay"
    with="transition-opacity ease-linear duration-300"
    hide="opacity-0"
    show="opacity-100">
    &hellip;
</x-transition>
```

Show or hide the child element, with transition effects, by adding an `open` attribute to the `<x-transition>` element or by setting the `.open` property to true.

```js
function showMenu() {
  overlay.open = true
}
```

### Compiled Script

Install using `npm`:

    npm install --save @captaincodeman/transition

Import into app:

```ts
import '@captaincodeman/transition'
```

Include in template using Tailwind CSS suggested classes setting show based on app templating system used (lit-element for instance):

```html
<!--
  Profile dropdown panel, show/hide based on dropdown state.

  Entering: "transition ease-out duration-200"
    From: "transform opacity-0 scale-95"
    To: "transform opacity-100 scale-100"
  Leaving: "transition ease-in duration-75"
    From: "transform opacity-100 scale-100"
    To: "transform opacity-0 scale-95"
-->
<x-transition
    enter="transition ease-out duration-200"
    enter-from="transform opacity-0 scale-95"
    enter-to="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leave-from="transform opacity-100 scale-100"
    leave-to="transform opacity-0 scale-95"
  >
  <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
    &hellip;
  </div>
</x-transition>
```

### Group Key

It's possible that a separate set of transitions could be enclosed within some parent that also uses transitions. To avoid them all reacting / waiting on the wrong things, use a `key` attribute to group them.

e.g. all mobile menu related transitions might have `key="mobile-menu"` which would make them ignore events from other transitions and vice-versa.

### TODO

Use [tailwind example code](https://blog.tailwindcss.com/utility-friendly-transitions-with-tailwindui-react)
