# Institute Intructor Attendance System

To run the code, first set up the .env file with variables-

`PORT`

`MONGO_DB_URI`

Then run these commands-

`npm i`

`npm run start`

## APIs

### Clock In API

`domain/api/entries/clock-in`

Request Type-`POST` 

Body-`{
  instructorId:MongoDbId for instructor(eg:'6576f4619882d6368fbc56f2')
}`

### Clock Out API

`domain/api/entries/clock-out`

Request Type-`POST` 

Body-`{
  instructorId:MongoDbId for instructor(eg:'6576f4619882d6368fbc56f2')
}`

### Fetch Total Time By Month for Instructor
`domain/api/entries/:instructorId/total-time?month=`

Request Type-`GET` 

Request Params-`instrcutorId`(MongoDBId for Instructor)

Request Query Params- `month`(Will be a number, indexed from 1 to 12 mapping to Jan-Dec)


## Thought Process

- By using just one primary collection that is entries I made sure to keep the database as lineant as possible
- Differentiated the in and out entries by adding a field called type
- Added validation by seperating entries based on the field in the backend
- Used a class structured approach for code structure and seperated in 4 layers- Controllers, Routes, Services and Models

Thank you for reading :)
