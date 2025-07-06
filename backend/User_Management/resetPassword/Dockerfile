FROM python:3.10-slim

WORKDIR /app

COPY . .
#EDIT
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5006
CMD ["python", "app.py"]