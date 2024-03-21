if [ -d dist ]; then rm -rf dist;  fi
tar -xvf dist.tar.gz
docker build -t 10.58.71.159:8297/boc-web:1.0.1 -f Dockerfile .
docker push 10.58.71.159:8297/boc-web:1.0.1
