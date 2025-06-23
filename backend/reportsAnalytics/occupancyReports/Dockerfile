FROM golang:1.23

WORKDIR /app


COPY go.mod go.sum ./
RUN go mod download


COPY . .


RUN go mod tidy


RUN go build -o occupancyReports main.go

EXPOSE 6000

CMD ["./occupancyReports"]
