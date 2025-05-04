class GenericRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return this.model.find();
  }

  async findById(id, populateFields = null) {
    if (populateFields) {
      return this.model.findById(id).populate(populateFields);
    }
    return this.model.findById(id);
  }

  async create(data) {
    const item = new this.model(data);
    return item.save();
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = GenericRepository;
