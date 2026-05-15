FROM node:20-alpine

WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --production

# Копіюємо решту коду
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
