// import { Message, MessageLoop } from '@lumino/messaging';
// import { Widget } from '@lumino/widgets';
// import * as Vue from 'vue';
// type VueRenderElement = Array<Vue.Component<any>> | Vue.Component<any>;
// // declare type VueRenderElement = Array<Vue.Component<any>> | Vue.Component<any>;

// export abstract class VueWidget extends Widget {
//   constructor() {
//     super();
//   }
//   /**
//    * Creates a new `VueWidget` that renders a constant element.
//    *
//    * @param element Vue element to render.
//    */
//   static create(element: VueRenderElement): VueWidget {
//     return new (class extends VueWidget {
//       render() {
//         return element;
//       }
//     })();
//   }

//   /**
//    * Render the content of this widget using the virtual DOM.
//    *
//    * This method will be called anytime the widget needs to be rendered, which
//    * includes layout triggered rendering.
//    *
//    * Subclasses should define this method and return the root Vue nodes here.
//    */
//   protected abstract render(): VueRenderElement | null;

//   /**
//    * Called to update the state of the widget.
//    *
//    * The default implementation of this method triggers
//    * VDOM based rendering by calling the `renderDOM` method.
//    */
//   protected onUpdateRequest(msg: Message): void {
//     // this.renderPromise = this.renderDOM();
//   }

//   /**
//    * Called after the widget is attached to the DOM
//    */
//   protected onAfterAttach(msg: Message): void {
//     // Make *sure* the widget is rendered.
//     MessageLoop.sendMessage(this, Widget.Msg.UpdateRequest);
//   }

//   /**
//    * Called before the widget is detached from the DOM.
//    */
//   protected onBeforeDetach(msg: Message): void {
//     // Unmount the component so it can tear down.
//     // if (this._rootDOM !== null) {
//     //   this._rootDOM.unmount();
//     //   this._rootDOM = null;
//     // }
//   }

//   //   /**
//   //    * Render the Vue nodes to the DOM.
//   //    *
//   //    * @returns a promise that resolves when the rendering is done.
//   //    */
//   //   private renderDOM(): Promise<void> {
//   //     return new Promise<void>((resolve) => {

//   //         const component = this.render()

//   //       const vnode = this.render();
//   //       if (this._rootDOM === null) {
//   //         this._rootDOM = createRoot(this.node);
//   //       }
//   //       // Split up the array/element cases so type inference chooses the right
//   //       // signature.
//   //       if (Array.isArray(vnode)) {
//   //         this._rootDOM.render(vnode);
//   //         // Resolves after the widget has been rendered.
//   //         // https://github.com/reactwg/react-18/discussions/5#discussioncomment-798304
//   //         requestIdleCallback(() => resolve());
//   //       } else if (vnode) {
//   //         this._rootDOM.render(vnode);
//   //         // Resolves after the widget has been rendered.
//   //         // https://github.com/reactwg/react-18/discussions/5#discussioncomment-798304
//   //         requestIdleCallback(() => resolve());
//   //       } else {
//   //         // If the virtual node is null, unmount the node content
//   //         this._rootDOM.unmount();
//   //         this._rootDOM = null;
//   //         requestIdleCallback(() => resolve());
//   //       }
//   //     });
//   //   }

//   // Set whenever a new render is triggered and resolved when it is finished.
//   renderPromise?: Promise<void>;
//   //   private _rootDOM: Root | null = null;
// }
