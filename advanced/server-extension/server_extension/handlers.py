import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join
import tornado


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post, 
    # patch, put, delete, options) to ensure only authorized user can request the 
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            'data': 'This is /hello/personal endpoint!'
        }))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary with a key 'name'
        input_data = self.get_json_body()
        data = {
            'greetings': 'Hello {}, enjoy JupyterLab!'.format(input_data['name'])
        }
        self.finish(json.dumps(data))


def setup_handlers(web_app):
    host_pattern = '.*$'

    base_url = web_app.settings['base_url']
    route_pattern = url_path_join(base_url, 'hello', 'personal')
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
