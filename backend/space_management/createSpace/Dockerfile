FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go mod tidy

RUN go build -o createSpace main.go

# Stage 2: Final image
FROM debian:bullseye-slim

WORKDIR /root/

COPY --from=builder /app/createSpace .

EXPOSE 3008

CMD ["./createSpace"]