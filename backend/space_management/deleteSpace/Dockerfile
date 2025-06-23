
FROM golang:1.20


WORKDIR /app


COPY go.mod ./
RUN go mod download


COPY . .


RUN go build -o deleteSpace main.go


EXPOSE 3012


CMD ["./deleteSpace"]
