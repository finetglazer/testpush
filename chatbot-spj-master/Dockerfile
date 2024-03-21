FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
