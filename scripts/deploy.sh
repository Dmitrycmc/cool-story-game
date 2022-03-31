npm run build --prefix=web-app && \
npm version patch && \

git checkout build && \
git reset --hard master && \
mv web-app/dist web-app/build && \

git add . && \
git commit --am --no-edit && \
git push -f && \

git checkout master