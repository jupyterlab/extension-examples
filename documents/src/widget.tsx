// Copyright 2018 Wolf Vollprecht
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { Signal } from '@lumino/signaling';

import { ExampleDocModel, ExampleDocChange, Position } from './model';

/**
 * DocumentWidget: widget that represents the view or editor for a file type.
 */
export class ExampleDocWidget extends DocumentWidget<
  ExamplePanel,
  ExampleDocModel
> {
  constructor(options: DocumentWidget.IOptions<ExamplePanel, ExampleDocModel>) {
    super(options);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this.content.dispose();
    super.dispose();
  }
}

/**
 * Widget that contains the main view of the DocumentWidget.
 */
export class ExamplePanel extends Widget {
  /**
   * Construct a `ExamplePanel`.
   *
   * @param context - The documents context.
   */
  constructor(context: DocumentRegistry.IContext<ExampleDocModel>) {
    super();
    this.addClass('jp-example-canvas');

    this._context = context;
    this._isDown = false;
    this._offset = { x: 0, y: 0 };
    this._clients = {};

    this._context.ready.then((value) => {
      this._context.model.sharedModelChanged.connect(this._onContentChanged);
      this._context.model.clientChanged.connect(this._onClientChanged);

      const obj = this._context.model.getSharedObject();
      this._cube.style.left = obj.x + 'px';
      this._cube.style.top = obj.y + 'px';
      this._cube.innerText = obj.content;

      this.update();
    });

    const obj = this._context.model.getSharedObject();
    this._cube = document.createElement('div');
    this._cube.className = 'jp-example-cube';
    this._cube.style.left = obj.x + 'px';
    this._cube.style.top = obj.y + 'px';
    this._cube.innerText = obj.content;
    this.node.appendChild(this._cube);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._context.model.sharedModelChanged.disconnect(this._onContentChanged);
    Signal.clearData(this);
    super.dispose();
  }

  /**
   * Handle `after-attach` messages sent to the widget.
   *
   * @param msg Widget layout message
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    this._cube.addEventListener('mousedown', this, true);
    this._cube.addEventListener('mouseup', this, true);
    this.node.addEventListener('mouseenter', this, true);
    this.node.addEventListener('mouseleave', this, true);
    this.node.addEventListener('mousemove', this, true);
  }

  /**
   * Handle `before-detach` messages sent to the widget.
   *
   * @param msg Widget layout message
   */
  protected onBeforeDetach(msg: Message): void {
    super.onBeforeDetach(msg);
    this._cube.removeEventListener('mousedown', this, true);
    this._cube.removeEventListener('mouseup', this, true);
    this.node.removeEventListener('mouseenter', this, true);
    this.node.removeEventListener('mouseleave', this, true);
    this.node.removeEventListener('mousemove', this, true);
  }

  /**
   * Handle event messages sent to the widget.
   *
   * @param event Event on the widget
   */
  public handleEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.type) {
      switch (event.type) {
        case 'mousedown':
          this._isDown = true;
          this._offset = {
            x: this._cube.offsetLeft - event.clientX,
            y: this._cube.offsetTop - event.clientY,
          };
          break;
        case 'mouseup':
          this._isDown = false;
          break;
        case 'mouseenter':
          break;
        case 'mouseleave':
          // Wrapping the modifications to the shared model into a flag
          // to prevent apply changes triggered by the same client
          this._context.model.setClient(undefined);
          break;
        case 'mousemove':
          // Wrapping the modifications to the shared model into a flag
          // to prevent apply changes triggered by the same client
          this._context.model.setClient({
            x: event.x - this.node.getBoundingClientRect().left,
            y: event.y - this.node.getBoundingClientRect().top,
          });

          if (this._isDown) {
            // Wrapping the modifications to the shared model into a flag
            // to prevent apply changes triggered by the same client
            this._cube.style.left = event.clientX + this._offset.x + 'px';
            this._cube.style.top = event.clientY + this._offset.y + 'px';
            this._context.model.setPosition({
              x: event.clientX + this._offset.x,
              y: event.clientY + this._offset.y,
            });
          }
          break;
      }
    }
  }

  /**
   * Callback to listen for changes on the model. This callback listens
   * to changes on shared model's content.
   *
   * @param sender The DocumentModel that triggers the changes.
   * @param change The changes on the model
   */
  private _onContentChanged = (
    sender: ExampleDocModel,
    change: ExampleDocChange
  ): void => {
    // Wrapping the updates into a flag to prevent apply changes triggered by the same client
    if (change.positionChange) {
      this._cube.style.left = change.positionChange.x + 'px';
      this._cube.style.top = change.positionChange.y + 'px';
      // updating the widgets to re-render it
      this.update();
    }
  };

  /**
   * Callback to listen for changes on the model. This callback listens
   * to changes on the different clients sharing the document.
   *
   * @param sender The DocumentModel that triggers the changes.
   * @param clients The list of client's states.
   */
  private _onClientChanged = (
    sender: ExampleDocModel,
    clients: Map<number, any>
  ): void => {
    clients.forEach((client, key) => {
      if (this._context.model.getClientId() !== key) {
        const id = key.toString();

        if (client.mouse && this._clients[id]) {
          this._clients[id].style.left = client.mouse.x + 'px';
          this._clients[id].style.top = client.mouse.y + 'px';
        } else if (client.mouse && !this._clients[id]) {
          const el = document.createElement('div');
          el.className = 'jp-example-client';
          el.style.left = client.mouse.x + 'px';
          el.style.top = client.mouse.y + 'px';
          el.style.backgroundColor = client.user.color;
          el.innerText = client.user.name;
          this._clients[id] = el;
          this.node.appendChild(el);
        } else if (!client.mouse && this._clients[id]) {
          this.node.removeChild(this._clients[id]);
          this._clients[id] = undefined;
        }
      }
    });

    // updating the widgets to re-render it
    this.update();
  };

  private _isDown: boolean;
  private _offset: Position;
  private _cube: HTMLElement;
  private _clients: { [id: string]: HTMLElement };
  private _context: DocumentRegistry.IContext<ExampleDocModel>;
}
