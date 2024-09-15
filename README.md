# React + TypeScript + Vite Project

This project is a minimal setup using **React**, **TypeScript**, and **Vite**. It includes hot module replacement (HMR), linting using **ESLint**, and a basic project structure to get started quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

Alternatively, you can use `yarn`:

```bash
git clone <repository-url>
cd <repository-folder>
yarn
```

### 2. Running the Development Server

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

or

```bash
yarn dev
```

This will start a local development server at http://localhost:3000 (or the specified port in your Vite config).

### 3. Building for Production

To build the project for production, run:

```bash
npm run build
```

or

```bash
yarn build
```

This will create an optimized build in the `dist` folder.

### 4. Linting

To run ESLint, use:

```bash
npm run lint
```

or

```bash
yarn lint
```

This will run ESLint with the TypeScript parser and the recommended ruleset.

### 5. Design Architecture

This project follows Clean Architecture principles to ensure maintainability and scalability. The code is structured into distinct layers:

- **Domain Layer**: Contains core business logic, like managing map-related entities.
- **Application Layer**: Orchestrates the flow of data between the UI and services, preparing it for presentation.
- **Infrastructure Layer**: Handles external systems, such as loading bird flu data and interacting with Mapbox for map rendering.
- **Presentation Layer**: Manages the UI with React, handling user interaction and displaying geospatial data on the map.

Clean Code practices are applied throughout, including:

- **Separation of Concerns**: Each layer has a clear, single responsibility, improving maintainability and testability.
- **Descriptive Naming**: Variables, functions, and classes are named for clarity.
- **Error Handling**: Errors are properly caught and handled.
- **Modularization**: Code is broken into small, reusable, and testable units.

By adhering to these principles, the project ensures flexibility, scalability, and ease of future enhancements.


### 6. Potential Improvements

Here are some suggestions to enhance this project further:

1. Getting Information About Birds and Virus Types:

- Enable detailed information retrieval about the bird species and the types of bird flu viruses affecting each canton when users interact with the map.

2. Time Analysis and Propagation:

- Visualize the propagation of bird flu cases over time with detailed time-series charts. This would allow the user to see how the virus spreads across different cantons.

### 7. License

This project is open source and available under the [MIT License](LICENSE).

````
### Key Changes:
- Replaced the original "Potential Improvements" section with the two specific improvements related to *bird flu information* and *time analysis*.
- Left the other technical improvements for further enhancements, such as linting, testing, and API integration.

This structure keeps the README clean while focusing on your specific project needs.

```python
# Output: README.md
React + TypeScript + Vite Project

````
