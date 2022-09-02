#!/bin/bash
# To be executed in the examples root folder
git commit -am "Update extension template"

for directory in ./*/
do
    if [ "${directory}" != "./scripts" ]; then
        pushd ${directory}
        copier update -o inline
        git add --all .
        git commit --amend -m "Update extension template"
        popd
    fi
done

git reset HEAD~1
