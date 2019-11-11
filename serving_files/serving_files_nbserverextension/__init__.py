import os
from notebook.utils import url_path_join
from tornado.web import StaticFileHandler

def _jupyter_server_extension_paths():
    return [{'module': 'jupyterlab_MyDoc'}]

def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    Args:
        nb_server_app (NotebookApp): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    # Prepend the base_url so that it works in a jupyterhub setting
    base_url = web_app.settings['base_url']
    doc_url = url_path_join(base_url, 'my_doc')

    doc_dir = os.path.join(os.path.dirname(__file__), 'static', 'doc', 'html')

    handlers = [(f'{doc_url}/(.*)',
                StaticFileHandler,
                {'path': doc_dir})]
    web_app.add_handlers('.*$', handlers)
