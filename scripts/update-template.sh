#!/bin/bash
# To be executed in the examples root folder

# Ensure to have the template dependencies
pip install copier jinja2-time

# Create dummy commit as we cannot update template on dirty HEAD
git commit -am "Update extension template"

for directory in ./*/
do
    if [ "${directory}" != "./scripts" ]; then
        pushd ${directory}
        copier update --trust -o inline
        rm -rf RELEASE.md .github/
        git add --all .
        git commit --amend -m "Update extension template"
        popd
    fi
done

git reset HEAD~1
