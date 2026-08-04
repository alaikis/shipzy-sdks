from setuptools import setup, find_packages

setup(
    name="zymeup-sdk",
    version="2.0.0",
    description="Official Zymeup logistics platform SDK for Python",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0",
    ],
    python_requires=">=3.8",
)
