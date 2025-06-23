
FROM golang:1.20


WORKDIR /app


COPY go.mod ./
RUN go mod download


COPY . .


RUN go build -o createSpace main.go


EXPOSE 3008

CMD ["./createSpace"]
