
FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o occupancyReports main.go

FROM scratch

WORKDIR /root/

COPY --from=builder /app/occupancyReports .
COPY --from=builder /app/.env .
COPY --from=builder /app/docs ./docs

EXPOSE 6000

CMD ["./occupancyReports"]