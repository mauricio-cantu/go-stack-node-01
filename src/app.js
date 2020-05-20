const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Repository ID." });
  }
  return next();
}
app.use("/repositories/:id", validateRepositoryId);

// helper function to create a Repository object
const makeRepository = (id, title, url, techs, likes) => {
  return {
    id,
    title,
    url,
    techs,
    likes,
  };
};

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = makeRepository(uuid(), title, url, techs, 0);

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repository = makeRepository(
    id,
    title,
    url,
    techs,
    repositories[repoIndex].likes
  );

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }
  repositories[repoIndex].likes++;
  return response.json(repositories[repoIndex]);
});

module.exports = app;
