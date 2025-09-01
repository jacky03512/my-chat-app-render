新增留言
Invoke-WebRequest -Uri "http://localhost:3000/messages" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"author": "Alice", "content": "Hello world"}'


curl -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"author": "Alice", "content": "Hello world"}'

取得留言列表
curl http://localhost:3000/messages


開啟瀏覽器介面,可對所有資料表進行修改
npx prisma studio

//----