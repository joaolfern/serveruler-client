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
   git clone https://github.com/yourusername/local-network-ip-inspector.git
   cd local-network-ip-inspector
   ```

2. Install dependencies:

   ```sh
   yarn
   ```

3. Set up the environment variables:
   ```sh
   cp .env.example .env
   ```

## Usage

1. Start the development server:

   ```sh
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build.
- `npm run update-ip-list`: Updates the IP list from the remote repository.

## Configuration

- **Network Configuration**: Update the network configuration in the `.env` file.
- **Service Ports**: Modify the service ports in the `database/README.md` file.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
