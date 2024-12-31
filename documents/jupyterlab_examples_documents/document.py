import json
from functools import partial
from typing import Any, Callable

import pycrdt
from jupyter_ydoc.ybasedoc import YBaseDoc


class YExampleDoc(YBaseDoc):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._content = self._ydoc.get("content", type=pycrdt.Map)

    @property
    def version(self) -> str:
        return "0.1.0"

    def get(self) -> str:
        """
        Returns the content of the document as saved by the contents manager.

        :return: Document's content.
        """
        data = self._content.to_py()
        position = json.loads(data["position"])
        return json.dumps(
            {"x": position["x"], "y": position["y"], "content": data["content"]},
            indent=2,
        )

    def set(self, raw_value: str) -> None:
        """
        Sets the content of the document from the contents manager read content.

        :param raw_value: The content of the document.
        """
        value = json.loads(raw_value)
        with self._ydoc.transaction():
            # clear document
            for key in self._content.keys():
                self._content.pop(key)
            for key in [k for k in self._ystate.keys() if k not in ("dirty", "path")]:
                self._ystate.pop(key)

            self._content["position"] = {"x": value["x"], "y": value["y"]}

            self._content["content"] = value["content"]

    #

    def observe(self, callback: "Callable[[str, Any], None]") -> None:
        """
        Subscribes to document changes.

        :param callback: Callback that will be called when the document changes.
        """
        self.unobserve()
        self._subscriptions[self._ystate] = self._ystate.observe(
            partial(callback, "state")
        )
        self._subscriptions[self._content] = self._content.observe(
            partial(callback, "content")
        )

    #
