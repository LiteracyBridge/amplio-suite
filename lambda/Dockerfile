FROM python:3.8-buster

WORKDIR /opt/python

RUN apt update \
  && apt install zip jq groff -y \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.30.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install

RUN curl -LJ https://codeload.github.com/jkehler/awslambda-psycopg2/zip/master -o /tmp/awslambda-psycopg2-master.zip \
  && unzip /tmp/awslambda-psycopg2-master.zip -d /tmp/ \
  && mv /tmp/awslambda-psycopg2-master/psycopg2-3.8 /usr/local/lib/python3.8/site-packages/psycopg2

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
