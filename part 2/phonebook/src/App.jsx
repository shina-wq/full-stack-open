import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name === newName
    );

    // Update existing person's number
    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmReplace) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber,
        };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id
                  ? response.data
                  : person
              )
            );

            setNewName("");
            setNewNumber("");
          });
      }

      return;
    }

    // Create new person
    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((response) => {
      setPersons(persons.concat(response.data));

      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(
          persons.filter((person) => person.id !== id)
        );
      });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        value={filter}
        onChange={(event) =>
          setFilter(event.target.value)
        }
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        handleNameChange={(event) =>
          setNewName(event.target.value)
        }
        newNumber={newNumber}
        handleNumberChange={(event) =>
          setNewNumber(event.target.value)
        }
      />

      <h3>Numbers</h3>

      <Persons
        persons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;