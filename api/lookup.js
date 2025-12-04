// api/lookup.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 👇 SỬA ĐOẠN NÀY: Trỏ thẳng vào thư mục assets của Android
const DB_PATH = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'assets', 'av_all_v3.db');

export default function handler(req, res) {
    const { word } = req.query;

    if (!word) return res.status(400).json({ error: "Thiếu từ khóa" });

    // In ra log để debug xem nó tìm đúng đường dẫn chưa
    console.log("Dang tim DB tai:", DB_PATH); 

    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không mở được Database tại đường dẫn này" });
        }
    });

    const sql = "SELECT * FROM av WHERE word = ? LIMIT 1"; // Nhớ check lại tên bảng nhé

    db.get(sql, [word.toLowerCase()], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (row) res.status(200).json(row);
        else res.status(404).json({ message: "Not found" });
        db.close();
    });
}
