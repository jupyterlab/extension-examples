import React from 'react';
import { FieldProps } from '@rjsf/utils';
import { addIcon, closeIcon } from '@jupyterlab/ui-components';

export class CustomField {
  _onAddClicked = (e: React.MouseEvent) => {
    const elem: HTMLInputElement | null = document.querySelector(
      '#metadataform-example-custom-field-add-input'
    );
    if (elem) {
      if (window.getComputedStyle(elem).display === 'none') {
        elem.setAttribute('style', 'display: block;');
        elem.focus();
      } else {
        this._addItem(elem.value);
      }
    }
  };

  _onAddItem = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      this._addItem(value);
    } else if (e.key === 'Escape') {
      const elem = e.target as HTMLInputElement;
      elem.value = '';
      elem.setAttribute('style', 'display: none;');
    }
  };

  _addItem(value: string) {
    const formData: string[] = this._props.formData || [];
    if (!formData.includes(value)) {
      formData.push(value);
      this._props.formContext.updateMetadata(
        { [this._props.name]: formData },
        true
      );
    }
  }

  _onRemoveItem = (e: React.MouseEvent) => {
    const formData: string[] = this._props.formData;
    const elem: HTMLDivElement | null = (e.target as HTMLSpanElement).closest(
      'tr.metadataform-example-custom-field-item'
    );
    const deleted: string = elem?.querySelector('span')?.textContent || '';
    const index = formData.indexOf(deleted);
    if (index > -1) {
      formData.splice(index, 1);
    }
    this._props.formContext.updateMetadata(
      { [this._props.name]: formData },
      true
    );
  };

  render(props: FieldProps): JSX.Element {
    this._props = props;
    return (
      <div id="metadataform-example-custom-field">
        <div className="jp-FormGroup-fieldLabel">{props.schema.title}</div>
        <div className="metadataform-example-custom-field-content">
          <table>
            <tbody>
              {props.formData &&
                props.formData.map((value: string, index: number) => (
                  <tr
                    key={`metadataform-example-custom-field_${value}`}
                    className={'metadataform-example-custom-field-item'}
                  >
                    <td>
                      <span>{value}</span>
                    </td>
                    <td>
                      <span onClick={this._onRemoveItem}>
                        <closeIcon.react />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div
            key={'metadataform-example-custom-field_add'}
            className={'metadataform-example-custom-field-add'}
          >
            <input
              type="text"
              id="metadataform-example-custom-field-add-input"
              className="form-control"
              onKeyDown={this._onAddItem}
              style={{ display: 'none' }}
            />
            <span onClick={this._onAddClicked}>
              <addIcon.react />
            </span>
          </div>
        </div>
      </div>
    );
  }

  private _props: any = {};
}
