import json

from jupyter_ydoc.ydoc import YBaseDoc
import y_py as Y


class YExampleDoc(YBaseDoc):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._content = self._ydoc.get_map('content')

    @property
    def version(self) -> str:
        return '0.1.0'

    def get(self) -> str:
        """
        Returns the content of the document as saved by the contents manager.

        :return: Document's content.
        """
        data = self._content.to_json()
        position = json.loads(data["position"])
        return json.dumps(
            {
                "x": position["x"],
                "y": position["y"],
                "content": data["content"]
            },
            indent=2
        )

    def set(self, raw_value: str) -> None:
        """
        Sets the content of the document from the contents manager read content.

        :param raw_value: The content of the document.
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

    def observe(self, callback: "Callable[Any, None]") -> None:
        """
        Subscribes to document changes.

        :param callback: Callback that will be called when the document changes.
        """
        self.unobserve()
        self._subscriptions[self._ystate] = self._ystate.observe(callback)
        self._subscriptions[self._content] = self._content.observe(callback)
