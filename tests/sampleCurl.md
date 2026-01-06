```
curl -X POST 'http://localhost:3015/api/users' -H 'Content-Type: application/json' -d '{"name":"Jane Smith","email":"jane.smith@example.com","mobile":"+9876543210"}'
{"message":"Duplicate mobile number found. Possible fraud.","id":3}%
```
