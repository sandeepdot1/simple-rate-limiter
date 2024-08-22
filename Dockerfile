FROM python:3.9-alpine

# RUN apt-get update

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 8080

EXPOSE 5000

CMD /bin/sh -c "python server/app.py & python -m http.server --directory frontend/ 8080"
