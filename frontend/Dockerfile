# Uporabimo uradno Node.js sliko
FROM node:14-alpine

# Nastavimo delovno mapo
WORKDIR /app

# Kopiramo package.json in namestimo odvisnosti
COPY package.json ./
RUN npm install

# Kopiramo preostale datoteke v kontejner
COPY . .

# Gradimo aplikacijo
RUN npm run build

# Uporabimo nginx za streženje statičnih datotek
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80 za dostop do aplikacije
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
