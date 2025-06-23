FROM golang:1.20

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN go build -o listSpace main.go

EXPOSE 3010

CMD ["./listSpace"]
