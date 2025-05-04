const mongoose = require("mongoose");

const createGenericController = (repository, config = {}) => ({
  getAll: async (req, res) => {
    try {
      const data = await repository.findAll();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: `Failed to fetch ${config.entityName}s` });
    }
  },

  getById: async (req, res) => {
    try {
      const item = await repository.findById(req.params.id, config.populate);
      if (!item)
        return res.status(404).json({ msg: `${config.entityName} not found` });
      res.status(200).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: `Failed to fetch ${config.entityName}` });
    }
  },

  create: async (req, res) => {
    try {
      const item = await repository.create(req.body);
      res.status(201).json({ msg: `${config.entityName} created`, item });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: `Failed to create ${config.entityName}` });
    }
  },

  update: async (req, res) => {
    try {
      const item = await repository.update(req.params.id, req.body);
      if (!item)
        return res.status(404).json({ msg: `${config.entityName} not found` });
      res.status(200).json({ msg: `${config.entityName} updated`, item });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: `Failed to update ${config.entityName}` });
    }
  },

  delete: async (req, res) => {
    try {
      const item = await repository.delete(req.params.id);
      if (!item)
        return res.status(404).json({ msg: `${config.entityName} not found` });
      res.status(200).json({ msg: `${config.entityName} deleted` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: `Failed to delete ${config.entityName}` });
    }
  },
});

module.exports = createGenericController;
