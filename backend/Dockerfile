# Set python image
FROM python:3.9-slim

# set workdir
WORKDIR /app

# copy all into container
COPY . /app

# Install all dependencies from requirements.txt
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-deps --no-cache-dir -r requirements.txt

# Let's allow Flask to run inside Docker
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# Enable developer mode (turn on debug)
ENV FLASK_ENV=development  

# Open port 5000 for the Flask application
EXPOSE 5000
EXPOSE 5678

# Running Flask Application
#CMD ["flask", "run", "--debug"]

RUN pip install debugpy

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND=noninteractive
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5679", "app.py"]

