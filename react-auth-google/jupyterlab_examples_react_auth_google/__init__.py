from ._version import __version__


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "@jupyterlab-examples/react-auth-google"
    }]
