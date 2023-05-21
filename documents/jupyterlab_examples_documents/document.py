import json
from functools import partial
from logging import getLogger

from jupyter_ydoc.ydoc import YBaseDoc
import y_py as Y


class YExampleDoc(YBaseDoc):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._content = self._ydoc.get_map('content')

    @property
    def version(self) -> str:
        return '0.1.0'

    def get(self) -> dict:
        """
        Returns the content of the document.

        :return: Document's content.
        :rtype: Any
        """
        getLogger("LabApp").warning("%s %s", type(self._content.to_json()), self._content.to_json())
        data = self._content.to_json()
        return {
            "x": data["position"]["x"],
            "y": data["position"]["y"],
            "content": data["content"]}

    def set(self, raw_value: str) -> None:
        """
        Sets the content of the document.

        :param value: The content of the document.
        :type value: Any
        """
        value = json.loads(raw_value)
        with self._ydoc.begin_transaction() as t:
            # clear document
            for key in self._content:
                self._content.pop(t, key)
            for key in [k for k in self._ystate if k not in ("dirty", "path")]:
                self._ystate.pop(t, key)

            self._content.set(t, "position", json.dumps({"x": value["x"], "y": value["y"]}))
            self._content.set(t, "content", value["content"])


    def observe(self, callback: "Callable[[str, Any], None]") -> None:
        """
        Subscribes to document changes.

        :param callback: Callback that will be called when the document changes.
        :type callback: Callable[[str, Any], None]
        """
        self.unobserve()
        self._subscriptions[self._ystate] = self._ystate.observe(partial(callback, "state"))
        self._subscriptions[self._content] = self._content.observe(partial(callback, "content"))