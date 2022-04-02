#!/bin/sh

if [ "$1" == 'common' ]
then
    path=.
else
    path="$1"
fi
readme="$path"/README.md;


if [ -f "$readme" ]
then
    line=$(awk '/AlDanial/{ print NR; exit }' "$readme")
    echo $line;
    if [ "$line" ]
    then
        line=$(expr "$line" - 2)
        sed -n "1,${line}p" "$readme" | tee "$readme" > /dev/null
    fi
fi


node_modules/.bin/cloc "$path" \
--exclude-dir=target,node_modules,.idea,.mvn,.angular,.vscode,.husky,.-S,build \
--not-match-f="mvnw(\.cmd)?|package(-lock)?.json" \
--found=files.txt \
--ignored=ignored.txt \
-md >> "$readme"

