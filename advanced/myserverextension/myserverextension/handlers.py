from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join
import json


class RouteHandler(APIHandler):
    def get(self):
        self.finish(json.dumps({
            'data': 'This is /hello/personal endpoint!'
        }))

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
