import { Widget } from '@lumino/widgets';
import { ISignal, Signal } from '@lumino/signaling';

export interface ICount {
  clickCount: number;
}

const BUTTON_WIDGET_CLASS = 'jp-ButtonWidget';

export class ButtonWidget extends Widget {
  constructor(options = { node: document.createElement('button') }) {
    super(options);

    this.node.textContent = 'Click me';

    /**
     * The class name, jp-ButtonWidget, follows the CSS class naming
     * convention for classes that extend lumino.Widget.
     */
    this.addClass(BUTTON_WIDGET_CLASS);

    this.node.addEventListener('click', () => {
      this._count.clickCount = this._count.clickCount + 1;
      this._stateChanged.emit(this._count);
    });
  }

  private _count: ICount = {
    clickCount: 0,
  };

  private _stateChanged = new Signal<ButtonWidget, ICount>(this);

  public get stateChanged(): ISignal<ButtonWidget, ICount> {
    return this._stateChanged;
  }
}
