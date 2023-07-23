import asyncio
import platform

if platform.system() == 'Emscriptem':
    import js
    import pyodide


class IndexedDB:
    """"""

    def __init__(self, name="JupyterLite Storage"):
        self.db_name = name
        self.queue = asyncio.Queue(1)

    async def get_IDBOpenDBRequest(self):
        """"""
        IDBOpenDBRequest = js.self.indexedDB.open(self.db_name)

        IDBOpenDBRequest.onsuccess = self.queue.put_nowait
        IDBOpenDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        if IDBOpenDBRequest.result is None:
            return None

        return IDBOpenDBRequest

    async def get_IDBObjectStore(self, IDBOpenDBRequest, store_name, mode):
        """"""
        modes = ["readonly", "readwrite"]
        msg = f'mode "{mode}" must be in {modes}'
        assert mode in modes, msg

        IDBTransaction = IDBOpenDBRequest.result.transaction(store_name, mode)
        IDBObjectStore = IDBTransaction.objectStore(store_name)

        return IDBObjectStore

    async def _get(self, IDBObjectStore, key):
        """"""
        IDBRequest = IDBObjectStore.get(key)

        IDBRequest.onsuccess = self.queue.put_nowait
        IDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        return IndexedDB._get_result(IDBRequest.result)

    async def _add(self, IDBObjectStore, value, key):
        """"""
        if isinstance(value, dict):
            val = pyodide.to_js(value, dict_converter=js.Object.fromEntries)
        else:
            val = value

        IDBRequest = IDBObjectStore.add(val, key)

        IDBRequest.onsuccess = self.queue.put_nowait
        IDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        return IndexedDB._get_result(IDBRequest.result)

    async def _delete(self, IDBObjectStore, key):
        """"""
        IDBRequest = IDBObjectStore.delete(key)

        IDBRequest.onsuccess = self.queue.put_nowait
        IDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        return IndexedDB._get_result(IDBRequest.result)

    async def _get_all(self, IDBObjectStore):
        """"""
        IDBRequest = IDBObjectStore.getAll()

        IDBRequest.onsuccess = self.queue.put_nowait
        IDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        return IndexedDB._get_result(IDBRequest.result)

    async def _put(self, IDBObjectStore, value, key):
        """"""
        if isinstance(value, dict):
            val = pyodide.to_js(value, dict_converter=js.Object.fromEntries)
        else:
            val = value

        IDBRequest = IDBObjectStore.put(val, key)

        IDBRequest.onsuccess = self.queue.put_nowait
        IDBRequest.onerror = self.queue.put_nowait

        await self.queue.get()

        return IndexedDB._get_result(IDBRequest.result)

    @staticmethod
    def _get_result(result):
        """"""
        if isinstance(result, pyodide.ffi.JsProxy):
            return result.to_py()
        if result is None:
            return None
        return result

    async def get_all(self, store_name):
        """"""
        IDBOpenDBRequest = await self.get_IDBOpenDBRequest()
        mode = "readonly"
        IDBObjectStore = await self.get_IDBObjectStore(
            IDBOpenDBRequest, store_name, mode
        )
        value = await self._get_all(IDBObjectStore)
        return value

    async def get(self, store_name, key):
        """"""
        IDBOpenDBRequest = await self.get_IDBOpenDBRequest()
        mode = "readonly"
        IDBObjectStore = await self.get_IDBObjectStore(
            IDBOpenDBRequest, store_name, mode
        )
        value = await self._get(IDBObjectStore, key)
        return value

    async def put(self, store_name, key, value):
        """"""
        IDBOpenDBRequest = await self.get_IDBOpenDBRequest()
        mode = "readwrite"
        IDBObjectStore = await self.get_IDBObjectStore(
            IDBOpenDBRequest, store_name, mode
        )
        value = await self._put(IDBObjectStore, value, key)
        return value

    async def delete(self, store_name, key):
        """"""
        IDBOpenDBRequest = await self.get_IDBOpenDBRequest()
        mode = "readwrite"
        IDBObjectStore = await self.get_IDBObjectStore(
            IDBOpenDBRequest, store_name, mode
        )
        value = await self._delete(IDBObjectStore, key)
        return value
