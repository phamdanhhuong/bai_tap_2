# Hướng Dẫn Cài Đặt MongoDB

## 1. Cài Đặt MongoDB Community Server

### Windows:
1. Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Chọn phiên bản Windows x64
3. Cài đặt với các tùy chọn mặc định
4. Chọn "Install MongoDB as a Service"

### Hoặc sử dụng Chocolatey:
```powershell
choco install mongodb
```

## 2. Tạo Tài Khoản Admin

### Khởi động MongoDB Shell:
```bash
mongosh
```

### Tạo admin user:
```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "123456",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

## 3. Cấu Hình Authentication

### Chỉnh sửa file config MongoDB (mongod.cfg):
```yaml
security:
  authorization: enabled
```

### Restart MongoDB service:
```powershell
net stop MongoDB
net start MongoDB
```

## 4. Test Kết Nối

### Kết nối với authentication:
```bash
mongosh -u admin -p 123456 --authenticationDatabase admin
```

### Tạo database cho project:
```javascript
use user_management
db.createCollection("users")
```

## 5. Alternative: MongoDB Atlas (Cloud)

Nếu bạn muốn sử dụng MongoDB Atlas (cloud):
1. Đăng ký tại: https://www.mongodb.com/atlas
2. Tạo cluster miễn phí
3. Tạo database user với username: admin, password: 123456
4. Cập nhật connection string trong file `src/config/mongodb.js`

## Connection String Format:
```
mongodb://admin:123456@localhost:27017/user_management?authSource=admin
```

## Kiểm Tra Kết Nối
Sau khi cài đặt, truy cập: http://localhost:3000/mongo để kiểm tra kết nối MongoDB.
