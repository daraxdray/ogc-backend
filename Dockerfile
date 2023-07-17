#Pulling node base image
FROM node:fermium-alpine3.15 

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

#Building App
RUN npm install

COPY . /usr/src/app

#Assigning the specified port
EXPOSE 3000

#Starting app
CMD [ "npm", "start"]