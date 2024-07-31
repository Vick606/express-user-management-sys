class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({firstName, lastName, email, age, bio}) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, {firstName, lastName, email, age, bio}) {
    this.storage[id] = { ...this.storage[id], firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }

  searchUsers(query) {
    return Object.values(this.storage).filter(user => 
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new UsersStorage();