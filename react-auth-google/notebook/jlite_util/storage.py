from .indexed_db import IndexedDB


class Storage:
    """"""

    def __init__(self) -> None:
        """"""
        self.idb_name = "JupyterLite Storage"
        self.idb = IndexedDB(self.idb_name)

    async def get(self, store, key):
        """"""
        res = await self.idb.get(store, key)
        return res

    async def get_all(self, store):
        """"""
        res = await self.idb.get_all(store)
        return res

    async def clear_all(self, verbose=False):
        """"""
        exceptions = ["jlite_util", "jlite-util"]
        if verbose:
            print(f"exceptions: {exceptions}")

        store = "checkpoints"
        if verbose:
            print(f"clear {store}")

        arr_in = await self.get_all(store)

        keys = []
        for e in arr_in:
            for f in e:
                key = f["path"]
                keys.append(key)

        keys = list(set(keys))
        for key in keys:
            await self.idb.delete(store, key)

        arr_after = await self.get_all(store)
        assert len(arr_after) == 0, "checkpoint not empty - should"

        store = "files"
        if verbose:
            print(f"clear {store}")

        arr_in = await self.get_all(store)

        keys = []
        for e in arr_in:
            key = e["path"]
            _keep = True
            for prefix in exceptions:
                if e["path"].startswith(prefix):
                    _keep = False
            if _keep:
                print(key)
                keys.append(key)

        keys = list(set(keys))

        for key in keys:
            print(store, key)
            await self.idb.delete(store, key)

        print("done")
