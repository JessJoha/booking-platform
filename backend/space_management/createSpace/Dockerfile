FROM golang:1.23

WORKDIR /app


COPY go.mod go.sum ./
RUN go mod download


COPY . .


RUN go mod tidy


RUN go build -o createSpace main.go


EXPOSE 3008

CMD ["./createSpace"]
