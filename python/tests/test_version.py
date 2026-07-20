from shipzy_sdk import __version__


def test_version_is_alpha():
    assert __version__ == "0.1.0-alpha.1"
