FROM python:3

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN apt update

COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/