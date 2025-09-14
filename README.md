# 🕹️ Planarity Puzzle
เกม Puzzle แนว **Planarity** ให้ผู้เล่นลากจุด (Nodes) เพื่อให้เส้นเชื่อมระหว่างจุด **ไม่ตัดกัน**  
พัฒนาโดย **React.js** + **SVG** พร้อมระบบนับเวลาและเก็บ Best Time  

---

## 💻 Features
- กราฟสุ่มพร้อม **ระดับความยาก**: Easy / Medium / Hard  
- ปรับ **จำนวนจุด** ได้ (3–20)  
- นับเวลาแบบ real-time  
- แสดง **Best Time** และเก็บข้อมูลใน LocalStorage  
- **ลากจุด (Drag & Drop)** เพื่อจัดตำแหน่ง  
- เส้นที่ตัดกันจะเปลี่ยนสีเป็น **แดง pulsate**  

---

## 🛠️ Installation
- **React.js** (Functional Components + Hooks)  
- **SVG** + CSS animations สำหรับ nodes และ edges  
- **LocalStorage** สำหรับเก็บ Best Time  

---

⚡ How to Play
1. เปิดเกมและเลือก **Level** (Easy, Medium, Hard)  
2. เลือก **จำนวนจุด** ที่ต้องการ  
3. คลิกและลาก **Nodes** เพื่อจัดเส้นทางใหม่  
4. เมื่อไม่มีเส้น **intersect** ทั้งหมด จะแสดงข้อความ **"🎉 คุณชนะแล้ว!"**  
5. เวลาที่ดีที่สุดจะถูกบันทึกใน **LocalStorage**  

---

💡 Tips
- เกมเหมาะสำหรับ ฝึกสมาธิและตรรกะ
- ลองปรับจำนวนจุดและระดับความยากเพื่อเพิ่มความท้าทาย
- สนุกกับการทำกราฟให้ Planar โดยไม่ให้เส้นตัดกัน!

---

## 🚀 Installation
1. Clone repository:
```bash
git clone https://github.com/<username>/planarity-puzzle.git
cd planarity-puzzle

2. ติดตั้ง dependencies:
npm install

3.รันโปรเจกต์:
npm start
# -Planarity-Puzzle
