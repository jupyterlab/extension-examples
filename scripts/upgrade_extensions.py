import os
import os.path as osp
import shutil
import subprocess
import sys


HERE = osp.abspath(osp.dirname(__file__))

def get_exts(dname):
    """Get the relative paths to all of the extensions"""
    paths = []
    for path in os.listdir(dname):
        if path in ['node_modules', '.git']:
            continue
        full_path = osp.join(dname, path)
        package_path = osp.join(full_path, 'package.json')
        if osp.exists(package_path):
            paths.append(full_path)
        elif osp.isdir(full_path):
            paths.extend(get_exts(full_path))
    return paths


def main():
    """Upgrade all of the extensions"""
    for ext in get_exts(osp.dirname(HERE)):
        print(ext)
        had_licence = osp.exists(osp.join(ext, 'LICENSE'))
        subprocess.run([sys.executable, '-m', 'jupyterlab.upgrade_extension', '--no-input', ext])
        # Overwrite setup.py and pyproject.toml directly
        for fname in ['setup.py', 'pyproject.toml']:
            shutil.move(osp.join(ext, '_temp_extension', fname), osp.join(ext, fname))
        # Remove unused files from the cookiecutter
        for fname in ['.prettierignore', '.prettierrc', 'LICENSE']:
            if had_licence and fname == 'LICENSE':
                continue
            os.remove(osp.join(ext, fname))
        # Remove unused directories from the cookiecutter
        for dname in ['.github', '_temp_extension']:
            shutil.rmtree(osp.join(ext, dname))


if __name__ == "__main__":
    main()
