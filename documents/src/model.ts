import { DocumentRegistry } from '@jupyterlab/docregistry';

import { YDocument, MapChange, createMutex } from '@jupyterlab/shared-models';

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

export class ExampleDocModel implements DocumentRegistry.IModel {
  /**
   * Construct a new ExampleDocModel.
   *
   * @param languagePreference
   * @param modelDB
   */
  constructor(languagePreference?: string, modelDB?: IModelDB) {
    this.modelDB = modelDB || new ModelDB();

    this.sharedModel.changed.connect(this._onSharedModelChanged);
    this.sharedModel.awareness.on('change', this._onClientChanged);
  }

  get dirty(): boolean {
    return this._dirty;
  }
  set dirty(value: boolean) {
    this._dirty = value;
  }

  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(value: boolean) {
    this._readOnly = value;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get contentChanged(): ISignal<this, void> {
    return this._contentChanged;
  }

  get stateChanged(): ISignal<this, IChangedArgs<any, any, string>> {
    return this._stateChanged;
  }

  get sharedModelChanged(): ISignal<this, ExampleDocChange> {
    return this._sharedModelChanged;
  }

  get clientChanged(): ISignal<this, Map<number, any>> {
    return this._clientChanged;
  }

  readonly defaultKernelName: string;

  readonly defaultKernelLanguage: string;

  readonly modelDB: IModelDB;

  readonly sharedModel: ExampleDoc = ExampleDoc.create();

  readonly mutex = createMutex();

  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  toString(): string {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || ''
    };
    return JSON.stringify(obj, null, 2);
  }

  fromString(data: string): void {
    const obj = JSON.parse(data);
    this.transact(() => {
      this.sharedModel.setContent('position', { x: obj.x, y: obj.y });
      this.sharedModel.setContent('content', obj.content);
    });
  }

  toJSON(): PartialJSONObject {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || ''
    };
    return obj;
  }

  fromJSON(data: PartialJSONObject): void {
    this.transact(() => {
      this.sharedModel.setContent('position', { x: data.x, y: data.y });
      this.sharedModel.setContent('content', data.content);
    });
  }

  initialize(): void {
    // not implemented
  }

  transact(cb: () => void): void {
    this.sharedModel.transact(cb);
  }

  getSharedObject(): SharedObject {
    const pos = this.sharedModel.getContent('position');
    const obj = {
      x: pos?.x || 10,
      y: pos?.y || 10,
      content: this.sharedModel.getContent('content') || ''
    };
    return obj;
  }

  setPosition(pos: Position): void {
    this.sharedModel.setContent('position', pos);
  }

  setContent(content: string): void {
    this.sharedModel.setContent('content', content);
  }

  setClient(pos: Position): void {
    this.sharedModel.awareness.setLocalStateField('mouse', pos);
  }

  private _onSharedModelChanged = (
    sender: ExampleDoc,
    changes: ExampleDocChange
  ): void => {
    this._sharedModelChanged.emit(changes);
  };

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

export type ExampleDocChange = {
  contextChange?: MapChange;
  contentChange?: string;
  positionChange?: Position;
};

export class ExampleDoc extends YDocument<ExampleDocChange> {
  constructor() {
    super();
    this._content = this.ydoc.getMap('content');
    this._content.observe(this._contentObserver);
  }

  /**
   * Dispose of the resources.
   */
  dispose(): void {
    this._content.unobserve(this._contentObserver);
  }

  public static create(): ExampleDoc {
    return new ExampleDoc();
  }

  /**
   * Returns an data.
   *
   * @param key
   * @param key: The key of the attribute.
   */
  public getContent(key: string): any {
    return this._content.get(key);
  }

  /**
   * Adds new data.
   *
   * @param key: The key of the attribute.
   * @param key
   * @param value
   * @param value: New source.
   */
  public setContent(key: string, value: any): void {
    this._content.set(key, value);
  }

  /**
   * Handle a change.
   *
   * @param event
   */
  private _contentObserver = (event: Y.YMapEvent<any>): void => {
    const changes: ExampleDocChange = {};

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
