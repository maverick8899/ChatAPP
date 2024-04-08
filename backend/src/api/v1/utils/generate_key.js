const crypto = require('node:crypto');

//random key1, key2
const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

console.table({ key1, key2 });

// Dòng này sử dụng hàm crypto.randomBytes(n) để tạo ra một chuỗi ngẫu nhiên có độ dài là 16 byte. Sau đó, nó sử dụng phương thức toString('hex') để chuyển đổi chuỗi ngẫu nhiên sang dạng hexa (hệ cơ số 16). Kết quả là một chuỗi hexa có độ dài là 32 ký tự (mỗi ký tự tương ứng với 4 bit).
