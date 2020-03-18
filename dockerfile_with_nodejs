FROM node:lts as app-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

FROM node:lts
WORKDIR /app
COPY --from=app-build /app/build /app/build
RUN npm install --global serve
EXPOSE 80
#CMD [ "serve", "-s ", "build", "-l", "80" ]
CMD serve -s build -l 80
