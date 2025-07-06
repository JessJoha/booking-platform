# Build stage
FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go mod tidy

# Build a statically linked binary for Linux
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o createSpace main.go

# Final image: use scratch for minimal size and no GLIBC dependency
FROM scratch

WORKDIR /root/

COPY --from=builder /app/createSpace .
COPY --from=builder /app/.env .
COPY --from=builder /app/docs ./docs

EXPOSE 3008

CMD ["./createSpace"]