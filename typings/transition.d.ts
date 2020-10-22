export declare class Transition extends HTMLElement {
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  get key(): string | null;
  get open(): boolean;
  set open(val: boolean);
}
