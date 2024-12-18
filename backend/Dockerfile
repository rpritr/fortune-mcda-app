# Uporabimo uradno Python sliko
FROM python:3.9-slim

# Nastavimo delovno mapo
WORKDIR /app

# Kopiramo vse datoteke v kontejner
COPY . /app

# Namestimo vse odvisnosti iz requirements.txt
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-deps --no-cache-dir -r requirements.txt

# Dovolimo Flasku, da deluje znotraj Dockerja
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# Omogoči način za razvijalce (vklopi debug)
ENV FLASK_ENV=development  

# Odprimo port 5000 za Flask aplikacijo
EXPOSE 5000
EXPOSE 5678

# Zagon Flask aplikacije
#CMD ["flask", "run", "--debug"]

RUN pip install debugpy

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND=noninteractive
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5679", "app.py"]

