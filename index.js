const express = require("express");

const server = express();

server.use(express.json());

let requests = 0;

const projects = [];

function checkProjectExists(req, res, next) {
  const id = req.params.id;

  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function quantityRequests(req, res, next) {
  requests += 1;

  console.log(requests);

  return next();
}

server.use(quantityRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;

  const project = {
    id,
    title,
    task: []
  };

  projects.push(project);

  return res.send("Projeto adicionado com sucesso!");
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const id = req.params.id;

  const tasks = req.body.tasks;

  const project = projects.find(item => item.id == id);

  project.task.push(tasks);

  return res.send("Tarefa adicionada com sucesso!");
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  const project = projects.find(item => item.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const id = req.params.id;
  const projectIndex = projects.findIndex(item => item.id == id);

  projects.splice(projectIndex, 1);
  return res.send("Projeto deletado com sucesso!");
});

server.listen(3000);
