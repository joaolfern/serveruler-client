# Local Network IP Inspector

This project is a local network IP inspector that helps you manage and monitor IP addresses and services within your local network.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Local Network IP Inspector provides a user-friendly interface to view and manage IP addresses and services in your local network. It includes features such as checking the status of services, copying IP addresses to the clipboard, and opening IP addresses in a new window.

## Features

- View a list of services and their corresponding IP addresses and ports.
- Check the online status of services.
- Copy IP addresses to the clipboard.
- Open IP addresses in a new browser window.

## Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:joaolfern/serveruler-client.git
   cd serveruler-client
   ```

2. Install dependencies:

   ```sh
   yarn
   ```

3. Add `REPO_URL` to the url `.env` file, ex:

   ```sh
   echo "REPO_URL=git@github.com:AGX-Software/ips.git" > .env
   ```

## Usage

1. Run `yarn ip` to get the lastest ip list from the repository

2. Create an optimized build with `yarn build`

3. Access Serveruler at `http://localhost:5173`.

## Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the project for production.
- `yarn ip`: Updates the IP list from the remote repository.

## Configuration

- `REPO_URL`: This is the URL of the repository from which the IP list will be fetched. You need to set this variable in the `.env` file to point to your repository. For example:

```sh
  REPO_URL=git@github.com:<path>.git
```

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
