<?php
// Kết nối tới cơ sở dữ liệu
$conn = mysqli_connect('localhost', 'username', 'password', 'database_name');

// Kiểm tra kết nối
if (!$conn) {
    die("Kết nối thất bại: " . mysqli_connect_error());
}

// Lấy danh sách người dùng từ cơ sở dữ liệu
$sql = "SELECT * FROM users";
$result = mysqli_query($conn, $sql);

// Hiển thị danh sách người dùng
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row['id'] . " - Username: " . $row['username'] . " - Role: " . $row['role'] . " - Status: " . $row['status'] . "<br>";
    }
} else {
    echo "Không có người dùng.";
}

// Đóng kết nối
mysqli_close($conn);
?>
