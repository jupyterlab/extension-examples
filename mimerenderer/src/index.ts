import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { Widget } from '@lumino/widgets';

import movieIcon from '../style/movie.svg';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'video/mp4';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-mp4';

/**
 * A widget for rendering mp4.
 */
export class VideoWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
    this._video = document.createElement('video');
    this._video.setAttribute('controls', '');
    this.node.appendChild(this._video);
  }

  /**
   * Render mp4 into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as string;
    this._video.src = `data:${MIME_TYPE};base64,${data}`;

    return Promise.resolve();
  }

  private _video: HTMLVideoElement;
  private _mimeType: string;
}

/**
 * A mime renderer factory for mp4 data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new VideoWidget(options)
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: '@jupyterlab-examples/mimerenderer:plugin',
  // description: 'Adds MIME type renderer for mp4 content',
  rendererFactory,
  rank: 0,
  dataType: 'string',
  fileTypes: [
    {
      name: 'mp4',
      extensions: ['.mp4'],
      fileFormat: 'base64',
      icon: {
        name: '@jupyterlab-examples/mimerenderer:video',
        svgstr: movieIcon
      },
      mimeTypes: [MIME_TYPE]
    }
  ],
  documentWidgetFactoryOptions: {
    name: 'JupyterLab mp4 Viewer',
    primaryFileType: 'mp4',
    modelName: 'base64',
    fileTypes: ['mp4'],
    defaultFor: ['mp4']
  }
};

export default extension;
