ARG VARIANT=latest
FROM oven/bun:${VARIANT}

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    git \
    nano \
    vim-tiny \
    && apt-get auto-remove -y \
    && apt-get clean -y \
    && chsh -s $(which bash) bun \
    && echo 'export PS1="\e[01;32m\u\e[m:\e[01;34m\w\e[m\$ "' >> /home/bun/.bashrc

RUN apt install curl -y
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

ENTRYPOINT ['source ~/.bashrc']