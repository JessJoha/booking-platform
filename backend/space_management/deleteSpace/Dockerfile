# Stage 1: Compilation
FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go mod tidy

RUN go build -o deleteSpace main.go

# Stage 2: Final image
FROM debian:bullseye-slim

WORKDIR /root/

COPY --from=builder /app/deleteSpace .

EXPOSE 3012

CMD ["./deleteSpace"]
