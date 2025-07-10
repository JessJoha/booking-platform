FROM ruby:3.0-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    tzdata

# Set working directory
WORKDIR /app

# Copy Gemfile and install gems
COPY Gemfile* ./
RUN bundle install --jobs 4 --retry 3

# Copy application code
COPY . .

# Create database and run migrations
RUN bundle exec rake db:create db:migrate

# Expose port
EXPOSE 4006

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4006/health || exit 1

# Start the application
CMD ["bundle", "exec", "ruby", "app.rb"]
