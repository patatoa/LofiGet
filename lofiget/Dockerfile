# start with a Python 3.9 base image
FROM python:3.9 AS base

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 libglib2.0-0 libxrender-dev -y

# copy the requirements file to the working directory
COPY requirements.txt .

# install the requirements
RUN pip install -r requirements.txt

# copy the rest of the files to the working directory

COPY . .

# run the app
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app