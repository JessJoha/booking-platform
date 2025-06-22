
FROM golang:1.21-alpine


WORKDIR /app


RUN apk update && apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download


COPY . .


RUN go build -o occupancyReports ./src/main.go


EXPOSE 8080


CMD ["./occupancyReports"]
