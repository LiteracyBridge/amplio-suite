FROM python:3.8-buster

WORKDIR /opt/python

RUN apt update \
  && apt install zip jq groff -y \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.30.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
