# x-transition

Web Component for adding animated transition effects by swapping CSS classes. Useful if you want to use Tailwind CSS / Tailwind UI with something _other_ than Alpine.js, Vue or React (e.g. lit-element / lit-html or Vanilla JavaScript).

Automatically handles nested transitions so parent isn't hidden until child transitions have completed.

688 bytes Brotli, 850 bytes Gzipped, 2.22 KB Minified.

[demo](https://x-transition.web.app/)

## Usage

Wrap the element to transition with `<x-transition>` and set the `open` attribute or `.open` property to control visibility. Define the classes to apply using"

`enter` Applied when the element is being shown (enter transition)
`enter-from` Applied at the start of the enter transition
`enter-to` Applied at the end of the enter transition

`leave` Applied when the element is being hidden (leave transition)
`leave-from` Applied at the start of the leave transition
`leave-to` Applied at the end of the leave transition

After enter, the elements `style.display` property is cleared.
After leave, the elements `style.display` property is set to `none`.

### CDN / Static HTML / Vanilla JS

Add the script to the page:

```html
<script src="https://cdnjs/whatevs/@captaincodeman/transition/js" type="module"></script>
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

    import '@captaincodeman/transition';

Include in template using Tailwind CSS suggested classes setting show based on app templating system used (lit-element for instance):

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
    .show=${this.showMenu}
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

## TODO:

### Group Key

It's possible that a separate set of transitions could be enclosed within some parent that also uses transitions. To avoid them all reacting / waiting on the wrong things, they could use a unique key to group them.

e.g. all mobile menu related transitions might have `key="mobile-menu"` which would make them ignore events from other transitions and vice-versa.

### Combined classes

Simplify classes to avoid repetition if pairs match:
* `enter` / `leave` (`with`?)
* `enter-from` / `leave-to` (`hide`?)
* `leave-from` / `enter-to` (`show`?)

Example:

```html
<x-transition
    enter="transition-opacity ease-linear duration-300"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity ease-linear duration-300"
    leave-from="opacity-100"
    leave-to="opacity-0"
>
```

```html
<x-transition
    show="opacity-100"
    hide="opacity-0"
    with="transition-opacity ease-linear duration-300"
>
```

### Example code

Use example from:
https://blog.tailwindcss.com/utility-friendly-transitions-with-tailwindui-react

## Notes

Trying to implement Tailwind CSS design with lit-element is _fairly_ straight-forward - I'm going with a "be-gone, ya' foul-beast-y shadowDOM of frustration!" approach, using postcss to create a document-level stylesheet (actually amazingly tiny) and setting `display: contents` on the custom elements so they don't mess up layout by introducing extra boxes ... which all seems to work OK.

But the part I've really noticed is lacking when trying to do things with Web Components are the little things that are baked into frameworks. Tailwind provide suggested CSS classes for interactions and the frameworks they document (Alpine.js, Vue and React) all provide similar `transition` components or directives to apply them.

Although it seems simple to just switch classes, often you have to handle nesting, where multiple things transition and the top-level components have to wait for their children to complete before being hidden, otherwise the transitions don't run.

So, I built an `<x-transition>` element that can be used to wrap a component that needs to switch classes which automatically handles the nesting.

Here's an example of how it looks in code:

```html
<x-transition
    .show=${this.showMenu}
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

Yay, got my `<x-transition>` element working ... makes it easy to wrap DOM nodes to apply CSS transitions in a similar way to Alpine.js, Vue and React provide (when working with Tailwind). Handles nested transitions so children complete before parent is hidden and syntax mirrors the language used in Tailwind.

Code Example:
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
  .open=${this.showDropdown}
  enter="transition ease-out duration-200"
  enter-from="transform opacity-0 scale-95"
  enter-to="transform opacity-100 scale-100"
  leave="transition ease-in duration-75"
  leave-from="transform opacity-100 scale-100"
  leave-to="transform opacity-0 scale-95"
>
```