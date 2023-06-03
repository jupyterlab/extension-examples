// Copyright 2023 Project Jupyter Contributors
//
// Original version has copyright 2018 Wolf Vollprecht and is licensed
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

import { ExampleDocModel, Position } from './model';

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

    this._model = context.model;
    this._isDown = false;
    this._offset = { x: 0, y: 0 };
    this._clients = new Map<string, HTMLElement>();

    context.ready.then((value) => {
      this._model.contentChanged.connect(this._onContentChanged);
      this._model.clientChanged.connect(this._onClientChanged);

      this._onContentChanged();

      this.update();
    });

    this._cube = document.createElement('div');
    this._cube.className = 'jp-example-cube';
    this._onContentChanged();
    this.node.appendChild(this._cube);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._model.contentChanged.disconnect(this._onContentChanged);
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
    this._cube.removeEventListener('mousedown', this, true);
    this._cube.removeEventListener('mouseup', this, true);
    this.node.removeEventListener('mouseenter', this, true);
    this.node.removeEventListener('mouseleave', this, true);
    this.node.removeEventListener('mousemove', this, true);
    super.onBeforeDetach(msg);
  }

  /**
   * Handle event messages sent to the widget.
   *
   * @param event Event on the widget
   */
  handleEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.type) {
      switch (event.type) {
        case 'mousedown':
          if (event.button === 0) {
            this._isDown = true;
            this._offset = {
              x: this._model.position.x - event.clientX,
              y: this._model.position.y - event.clientY,
            };
          }
          break;
        case 'mouseup':
          if (event.button === 0) {
            this._isDown = false;
          }
          break;
        case 'mouseenter':
          break;
        case 'mouseleave':
          // Wrapping the modifications to the shared model into a flag
          // to prevent apply changes triggered by the same client
          this._model.setCursor(null);
          break;
        case 'mousemove': {
          const bbox = this.node.getBoundingClientRect();
          // Wrapping the modifications to the shared model into a flag
          // to prevent apply changes triggered by the same client
          this._model.setCursor({
            x: event.x - bbox.left,
            y: event.y - bbox.top,
          });

          if (this._isDown) {
            this._model.position = {
              x: event.clientX + this._offset.x,
              y: event.clientY + this._offset.y,
            };
          }
          break;
        }
      }
    }
  }

  /**
   * Callback to listen for changes on the model. This callback listens
   * to changes on shared model's content.
   */
  private _onContentChanged = (): void => {
    this._cube.style.left = this._model.position.x + 'px';
    this._cube.style.top = this._model.position.y + 'px';

    this._cube.innerText = this._model.content;
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
      if (this._model.clientId !== key) {
        const id = key.toString();

        if (client.mouse) {
          if (this._clients.has(id)) {
            const elt = this._clients.get(id)!;
            elt.style.left = client.mouse.x + 'px';
            elt.style.top = client.mouse.y + 'px';
          } else {
            const el = document.createElement('div');
            el.className = 'jp-example-client';
            el.style.left = client.mouse.x + 'px';
            el.style.top = client.mouse.y + 'px';
            el.style.backgroundColor = client.user.color;
            el.innerText = client.user.name;
            this._clients.set(id, el);
            this.node.appendChild(el);
          }
        } else if (this._clients.has(id)) {
          this.node.removeChild(this._clients.get(id)!);
          this._clients.delete(id);
        }
      }
    });
  };

  private _isDown: boolean;
  private _offset: Position;
  private _cube: HTMLElement;
  private _clients: Map<string, HTMLElement>;
  private _model: ExampleDocModel;
}
