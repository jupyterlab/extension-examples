import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';

import { IModelDB } from '@jupyterlab/observables';

import { Contents } from '@jupyterlab/services';

import { ExampleDocWidget, ExamplePanel } from './widget';

import { ExampleDocModel } from './model';

/**
 * A widget factory for xml.
 */
export class ExampleWidgetFactory extends ABCWidgetFactory<
  ExampleDocWidget,
  ExampleDocModel
> {
  /**
   * Create a new widget given a context.
   *
   * @param options
   */
  constructor(options: DocumentRegistry.IWidgetFactoryOptions) {
    super(options);
  }

  protected createNewWidget(
    context: DocumentRegistry.IContext<ExampleDocModel>
  ): ExampleDocWidget {
    return new ExampleDocWidget({
      context,
      content: new ExamplePanel(context)
    });
  }
}

export class ExampleDocModelFactory
  implements DocumentRegistry.IModelFactory<ExampleDocModel> {
  /**
   * The name of the model.
   */
  get name(): string {
    return 'example-model';
  }

  /**
   * The content type of the file.
   */
  get contentType(): Contents.ContentType {
    return 'file';
  }

  /**
   * The format of the file.
   */
  get fileFormat(): Contents.FileFormat {
    return 'text';
  }

  /**
   * Get whether the model factory has been disposed.
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  dispose(): void {
    this._disposed = true;
  }

  preferredLanguage(path: string): string {
    return '';
  }

  createNew(languagePreference?: string, modelDB?: IModelDB): ExampleDocModel {
    return new ExampleDocModel(languagePreference, modelDB);
  }

  private _disposed = false;
}
