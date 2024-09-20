# how to run the project

# 1)  add .env file in main directory.
# 2) go to main directory and run command ----> npm i
# 3) run command ----> npm strat

# thses is the curl of all apis put it on the postman and test out the apis
# 1) delete task api curl --location --request DELETE 'localhost:8900/task/deleteTask/66ed0def397423af46f5054c'
# 2) create task api curl --location 'localhost:8900/task/createTask' \
--header 'Content-Type: application/json' \
--data '{

    "data":{
        "title":"new task",
        "description":"this is my new task",
        "dueDate":"2024-09-28",
        "priority":2,
        "status":""
    }
}'
# 3) get task apis by filter dueDate , status,  priority
   a) by priority curl --location 'localhost:8900/task/getTaskByFilter?priority=1' \
    --data ''

  b) by status curl --location 'localhost:8900/task/getTaskByFilter?status=pending' \
    --data ''

 c) curl --location 'localhost:8900/task/getTaskByFilter?dueDate=2024-09-29' \
    --data ''

# 4) get task apis by id  curl --location 'localhost:8900/task/getTaksById/66ed697411b72872d2f3c308' \
    --data ''

# 5) get task apis of pagination curl --location 'localhost:8900/task/getAllTask?page=1&limit=2' \
    --data ''

# 6) update task by id curl --location --request PUT 'localhost:8900/task/updateTask/66ed697411b72872d2f3c308' \
--header 'Content-Type: application/json' \
    --data '{
    "title": "new task 1.1",
    "description": "this is my new task 1.1",
    "dueDate": "2024-09-30",
    "priority": 2,
    "status": "in-progress"
}'

