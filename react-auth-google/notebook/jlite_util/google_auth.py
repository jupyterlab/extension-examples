import platform

from .indexed_db import IndexedDB


class GoogleAuth:
    """"""

    def __init__(self) -> None:
        """"""
        self.idb_name = "GIS"
        self.store_name =  'auth'

        self.is_idb = False

        if platform.system() == 'Emscriptem':
            self.is_idb = True
            self.idb = IndexedDB(self.idb_name)

    async def get_data(self):
        """"""
        if not self.is_idb:
            print('not on jupyterlite: manually copy token')
            return None
        
        res = await self.idb.get_all(self.store_name)

        if len(res) == 0:
            return None
        
        assert len(res) ==1, 'UNEXPECTED'
        
        data = res[0]
        return data
