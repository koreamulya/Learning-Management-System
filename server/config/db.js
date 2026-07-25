const fs = require('fs');
const path = require('path');

// Simple persistent JSON database fallback for zero-setup local execution
const DATA_DIR = path.join(__dirname, '../data_store');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalStore {
  constructor(entityName) {
    this.entityName = entityName;
    this.filePath = path.join(DATA_DIR, `${entityName}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`Error reading ${this.entityName}.json:`, e);
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error writing ${this.entityName}.json:`, e);
    }
  }

  find(query = {}) {
    return this.data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(query = {}) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  findById(id) {
    return this.findOne({ _id: id }) || this.findOne({ id: id });
  }

  insertOne(doc) {
    const newItem = {
      _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    this.data.push(newItem);
    this.save();
    return newItem;
  }

  updateOne(query, updates) {
    const item = this.findOne(query);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return item;
  }

  findByIdAndUpdate(id, updates) {
    const index = this.data.findIndex(i => i._id === id || i.id === id);
    if (index === -1) return null;
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[index];
  }

  deleteOne(query) {
    const index = this.data.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      const removed = this.data.splice(index, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  seedIfEmpty(initialData) {
    if (this.data.length === 0 && Array.isArray(initialData)) {
      this.data = initialData;
      this.save();
      console.log(`[Store] Seeded ${initialData.length} records into ${this.entityName}`);
    }
  }
}

const stores = {
  User: new LocalStore('users'),
  Course: new LocalStore('courses'),
  Progress: new LocalStore('progress'),
  Review: new LocalStore('reviews'),
  Discussion: new LocalStore('discussions')
};

module.exports = {
  stores,
  connectDB: async () => {
    console.log('[DB] Using optimized local persistent database store for seamless execution.');
    return true;
  }
};
