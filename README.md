# Coding Excerise - Simple Budgeting API (Backend) #

## Development Instructions (Local) ##

1. Docker setup: Install Docker on your machine if you haven't done so already, then run the following command to start all services in a single container (this is for development purposes only):

```bash
docker compose up
```

2. Copy `.env-example` to `.env` and fill in your credentials for the database, security salts (like JWT_SECRET), and other necessary environment variables (if needed).

```bash
cp .env-example .env
```

3. Install dependencies with pnpm.

```bash
pnpm i
```

4. Run developement server with hot reloads enabled.

```bash
pnpm run start:dev
```

5. Insomnia (optional): You can use this tool as an API client which will allow you to test your endpoints directly from here. After installing it, import the `insomnia-exported.json` file and start using them for testing purposes.

## Further reading: ##

* [Requirement Document](REQUIREMENT.md)