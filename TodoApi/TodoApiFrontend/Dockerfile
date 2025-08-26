FROM nginx:alpine

# Copy static assets
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./app.js /usr/share/nginx/html/app.js
COPY ./style.css /usr/share/nginx/html/style.css
COPY ./app_wallpaper.jpg /usr/share/nginx/html/app_wallpaper.jpg

# Expose default HTTP port
EXPOSE 80

# Nginx default command runs automatically