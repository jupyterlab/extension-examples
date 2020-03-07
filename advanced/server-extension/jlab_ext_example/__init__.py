from ._version import __version__
from .handlers import setup_handlers


def _jupyter_server_extension_paths():
    return [{
        'module': 'jlab_ext_example'
    }]


def load_jupyter_server_extension(nb_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    nb_app: notebook.notebookapp.NotebookApp
        Notebook application instance
    """
    url_path = 'jlab-ext-example'
    setup_handlers(nb_app.web_app, url_path)
    nb_app.log.info('Registered jlab_ext_example extension at URL path /{}'.format(url_path))
