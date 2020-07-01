# :sparkles: NodeJS - Postgres and Multer

A challenge to reinforce what I learned during the GoStack bootcamp about TypeORM and file upload with Multer.
This NodeJS project simulates an transaction log app. It stores every transaction that was made or received and returns the balance.
<p>Every transaction is in this format: { title, type: 'income' | 'outcome', value, category }.</p>
<p>And the balance is going to be in this format: { income, outcome, total }.</p>

Example of an transaction:
```
{
  "id": "uuid",
  "title": "Salary",
  "value": 3000,
  "type": "income",
  "category": "Salary"
}
```

## :rocket: Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### :card_file_box: Prerequisites

Postgres (Create a database named 'gostack_desafio06' with 'docker' as password)
Node: version 12 or higher
Yarn: version 1


### :construction: Installing

After you clone this repository, enter the repository folder and run on the terminal:
```
yarn
```

After that, you may be able to start the server using:

```
yarn dev:server
```

## :globe_with_meridians: Routes:

Right now, we have routes to list, create, delete and create transactions from a csv file.

<p>GET http://localhost:3333/ (list)</p>
<p>POST http://localhost:3333/ (create)</p>
<p>DELETE http://localhost:3333/:id (delete. id = transaction id)</p>
<p>POST http://localhost:3333/import (Import csv. Use Multi part form to send the csv file).</p>

## :white_check_mark: Running the tests

If you want to test any implementation, you should be able to run:

```
yarn test
```

### Break down into end to end tests

The tests are going to verify if it's possible to create, update, list and delete the repositories and if it's possible to give a like to a certain repository.


## :hammer: Built With

* [NodeJs](https://nodejs.org/en/) - Is a JavaScript runtime built on Chrome's V8 JavaScript engine.


## :page_facing_up: License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/twistershark/conceitos-nodejs/blob/master/LICENSE) file for details


