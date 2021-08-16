import { DocumentRegistry } from '@jupyterlab/docregistry';

import { YDocument, MapChange } from '@jupyterlab/shared-models';

import { IModelDB, ModelDB } from '@jupyterlab/observables';

import { IChangedArgs } from '@jupyterlab/coreutils';

import { PartialJSONObject } from '@lumino/coreutils';

import { ISignal, Signal } from '@lumino/signaling';

import * as Y from 'yjs';

export type SharedObject = {
  x: number;
  y: number;
  content: string;
};

export type Position = {
  x: number;
  y: number;
};

/**
 * DocumentModel: this Model represents the content of the file
 */
export class ExampleDocModel implements DocumentRegistry.IModel {
  /**
   * Construct a new ExampleDocModel.
   *
   * @param languagePreference Language
   * @param modelDB Document model database
   */
  constructor(languagePreference?: string, modelDB?: IModelDB) {
    this.modelDB = modelDB || new ModelDB();

    // Listening for changes on the shared model to propagate them
    this.sharedModel.changed.connect(this._onSharedModelChanged);
    this.sharedModel.awareness.on('change', this._onClientChanged);
  }

  /**
   * get/set the dirty attribute to know when the
   * content in the document differs from disk
   *
   * @returns dirty attribute
   */
  get dirty(): boolean {
    return this._dirty;
  }
  set dirty(value: boolean) {
    this._dirty = value;
  }

  /**
   * get/set the readOnly attribute to know whether this model
   * is read only or not
   *
   * @returns readOnly attribute
   */
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(value: boolean) {
    this._readOnly = value;
  }

  /**
   * get the isDisposed attribute to know whether this model
   * has been disposed or not
   *
   * @returns Model status
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * get the signal contentChange to listen for changes on the content
   * of the model.
   *
   * NOTE: The content refers to de data stored in the model while the state refers
   * to the metadata or attributes of the model.
   *
   * @returns The signal
   */
  get contentChanged(): ISignal<this, void> {
    return this._contentChanged;
  }

  /**
   * get the signal stateChanged to listen for changes on the state
   * of the model.
   *
   * NOTE: The content refers to de data stored in the model while the state refers
   * to the metadata or attributes of the model.
   *
   * @returns The signal
   */
  get stateChanged(): ISignal<this, IChangedArgs<any, any, string>> {
    return this._stateChanged;
  }

  /**
   * get the signal sharedModelChanged to listen for changes on the content
   * of the shared model.
   *
   * @returns The signal
   */
  get sharedModelChanged(): ISignal<this, ExampleDocChange> {
    return this._sharedModelChanged;
  }

  /**
   * get the signal clientChanged to listen for changes on the clients sharing
   * the same document.
   *
   * @returns The signal
   */
  get clientChanged(): ISignal<this, Map<number, any>> {
    return this._clientChanged;
  }

  /**
   * defaultKernelName and defaultKernelLanguage are only used by the Notebook widget
   * or documents that use kernels, and they store the name and the language of the kernel.
   */
  readonly defaultKernelName: string;
  readonly defaultKernelLanguage: string;

  /**
   * modelBD is the datastore for the content of the document.
   * modelDB is not a shared datastore so we don't use it on this example since
   * this example is a shared document.
   */
  readonly modelDB: IModelDB;

  /**
   * New datastore introduced in JupyterLab v3.1 to store shared data and make notebooks
   * collaborative
   */
  readonly sharedModel: ExampleDoc = ExampleDoc.create();

  /**
   * Dispose of the resources held by the model.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  /**
   * Should return the data that you need to store in disk as a string.
   * The context will call this method to get the file's content and save it
   * to disk
   *
   * @returns The data
   */
  toString(): string {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || '',
    };
    return JSON.stringify(obj, null, 2);
  }

  /**
   * The context will call this method when loading data from disk.
   * This method should implement the logic to parse the data and store it
   * on the datastore.
   *
   * @param data Serialized data
   */
  fromString(data: string): void {
    const obj = JSON.parse(data);
    this.sharedModel.transact(() => {
      this.sharedModel.setContent('position', { x: obj.x, y: obj.y });
      this.sharedModel.setContent('content', obj.content);
    });
  }

  /**
   * Should return the data that you need to store in disk as a JSON object.
   * The context will call this method to get the file's content and save it
   * to disk.
   *
   * NOTE: This method is only used by the context of the notebook, every other
   * document will load/save the data through toString/fromString.
   *
   * @returns Model JSON representation
   */
  toJSON(): PartialJSONObject {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || '',
    };
    return obj;
  }

  /**
   * The context will call this method when loading data from disk.
   * This method should implement the logic to parse the data and store it
   * on the datastore.
   *
   * NOTE: This method is only used by the context of the notebook, every other
   * document will load/save the data through toString/fromString.
   *
   * @param data Serialized model
   */
  fromJSON(data: PartialJSONObject): void {
    this.sharedModel.transact(() => {
      this.sharedModel.setContent('position', { x: data.x, y: data.y });
      this.sharedModel.setContent('content', data.content);
    });
  }

  initialize(): void {
    // nothing to do
  }

  /**
   * Returns the Id of the client from the YDoc
   *
   * @returns client id
   */
  getClientId(): number {
    return this.sharedModel.awareness.clientID;
  }

  /**
   * Returns the SharedObject
   *
   * @returns SharedObject
   */
  getSharedObject(): SharedObject {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || '',
    };
    return obj;
  }

  /**
   * Sets the position of the SharedObject
   *
   * @param pos Position
   */
  setPosition(pos: Position): void {
    this.sharedModel.setContent('position', pos);
  }

  /**
   * Sets the text inside the SharedObject
   *
   * @param content Text
   */
  setContent(content: string): void {
    this.sharedModel.setContent('content', content);
  }

  /**
   * Sets the mouse's position of the client
   *
   * @param pos Mouse position
   */
  setClient(pos: Position): void {
    // Adds the position of the mouse from the client to the shared state.
    this.sharedModel.awareness.setLocalStateField('mouse', pos);
  }

  /**
   * Callback to listen for changes on the sharedModel. This callback listens
   * to changes on shared model's content and propagates them to the DocumentWidget.
   *
   * @param sender The sharedModel that triggers the changes.
   * @param changes The changes on the sharedModel.
   */
  private _onSharedModelChanged = (
    sender: ExampleDoc,
    changes: ExampleDocChange
  ): void => {
    this._sharedModelChanged.emit(changes);
  };

  /**
   * Callback to listen for changes on the sharedModel. This callback listens
   * to changes on the different clients sharing the document and propagates
   * them to the DocumentWidget.
   */
  private _onClientChanged = () => {
    const clients = this.sharedModel.awareness.getStates();
    this._clientChanged.emit(clients);
  };

  private _dirty = false;
  private _readOnly = false;
  private _isDisposed = false;
  private _contentChanged = new Signal<this, void>(this);
  private _stateChanged = new Signal<this, IChangedArgs<any>>(this);
  private _clientChanged = new Signal<this, Map<number, any>>(this);
  private _sharedModelChanged = new Signal<this, ExampleDocChange>(this);
}

/**
 * Type representing the changes on the sharedModel.
 *
 * NOTE: Yjs automatically syncs the documents of the different clients
 * and triggers an event to notify that the content changed. You can
 * listen to this changes and propagate them to the widget so you don't
 * need to update all the data in the widget, you can only update the data
 * that changed.
 *
 * This type represents the different changes that may happen and ready to use
 * for the widget.
 */
export type ExampleDocChange = {
  contextChange?: MapChange;
  contentChange?: string;
  positionChange?: Position;
};

/**
 * SharedModel, stores and shares the content between clients.
 */
export class ExampleDoc extends YDocument<ExampleDocChange> {
  constructor() {
    super();
    // Creating a new shared object and listen to its changes
    this._content = this.ydoc.getMap('content');
    this._content.observe(this._contentObserver);
  }

  /**
   * Dispose of the resources.
   */
  dispose(): void {
    this._content.unobserve(this._contentObserver);
  }

  /**
   * Static method to create instances on the sharedModel
   *
   * @returns The sharedModel instance
   */
  public static create(): ExampleDoc {
    return new ExampleDoc();
  }

  /**
   * Returns an the requested object.
   *
   * @param key The key of the object.
   * @returns The content
   */
  public getContent(key: string): any {
    return this._content.get(key);
  }

  /**
   * Adds new data.
   *
   * @param key The key of the object.
   * @param value New object.
   */
  public setContent(key: string, value: any): void {
    this._content.set(key, value);
  }

  /**
   * Handle a change.
   *
   * @param event Model event
   */
  private _contentObserver = (event: Y.YMapEvent<any>): void => {
    const changes: ExampleDocChange = {};

    // Checks which object changed and propagates them.
    if (event.keysChanged.has('position')) {
      changes.positionChange = this._content.get('position');
    }

    if (event.keysChanged.has('content')) {
      changes.contentChange = this._content.get('content');
    }

    this._changed.emit(changes);
  };

  private _content: Y.Map<any>;
}
