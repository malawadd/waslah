# Nodejs App
FROM node:16.19.0 as node

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
 
# Install dependencies
RUN npm install --force
 
# Copy the app's source code to the container
COPY . .
 
# Build the Next.js app
RUN npm run build
 
# Expose the port that Next.js runs on
EXPOSE 3000
 
# Run the Next.js app
CMD ["yarn", "start"]
