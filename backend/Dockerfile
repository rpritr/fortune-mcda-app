# Uporabimo uradno Python sliko
FROM python:3.9-slim

# Nastavimo delovno mapo
WORKDIR /app

# Kopiramo vse datoteke v kontejner
COPY . /app

# Namestimo vse odvisnosti iz requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Dovolimo Flasku, da deluje znotraj Dockerja
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Odprimo port 5000 za Flask aplikacijo
EXPOSE 5000

# Zagon Flask aplikacije
CMD ["flask", "run"]
