const Redis = require('ioredis');
const client = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PWD
});

//* client.ping((err, pong) => {
//     console.log(pong.red);
// });

if (client.on('connect', () => true) && client.on('ready', (err) => true)) {
    console.log('--> Redis ::: is ::: ready '.green);
}

client.on('error', (err) => {
    console.log(`--> Redis ::: client ::: error: ${err}`.red);
});

module.exports = client;

//ping Redis Client sẽ gửi yêu cầu ping đến Redis Server, và nếu kết nối được duy trì, Redis Server sẽ trả về pong. Kết quả pong được in ra màn hình bởi lệnh console.log(pong).

//Khi client Redis kết nối thành công với Redis server, callback được đăng ký với 'connect' sẽ được gọi, callback đăng ký với 'error' sẽ được gọi nếu có lỗi xảy ra, và callback được đăng ký với 'ready' sẽ được gọi khi client Redis đã sẵn sàng để thực hiện các truy vấn Redis.

//legacyMode Khi legacyMode được bật, client Redis sẽ gửi các lệnh Redis theo cách cũ hơn, được mã hóa bằng cách sử dụng một số mã lệnh đặc biệt, giúp tương thích với các server Redis cũ hơn.(trước 2.6)
//Trong Redis, cổng mặc định là 6379 và địa chỉ host mặc định là 127.0.0.1
/*Lỗi "ClientClosedError: The client is closed" xuất hiện khi Redis client đã bị đóng trước khi gửi một yêu cầu Redis. Điều này có thể xảy ra khi client Redis đóng trước khi truy vấn Redis hoàn tất, hoặc khi có lỗi xảy ra trong quá trình truyền tải dữ liệu. => dùng async await*/
