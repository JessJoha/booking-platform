# Stage 1: Compilation
FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN go build -o listSpace main.go

# Stage 2: Final image
FROM debian:bullseye-slim

WORKDIR /root/

COPY --from=builder /app/listSpace .

EXPOSE 3010

CMD ["./listSpace"]
