import json


async def test_get_hello(jp_fetch):
    # When
    response = await jp_fetch("jupyterlab-examples-server", "hello")

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload == {
        "data": "This is /jupyterlab-examples-server/hello endpoint!"
    }