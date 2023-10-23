
# VAVSA EXHI 4

มี 3 โฟลเดอร์ 

1. Arduino **dont touch it**.
- ตอนนี้ใช้หลักการเวลาเรา Input ข้อมูลใน **Arduino** แล้ว Arduino จะเปิด **Serial port** ส่ง Data เข้ามาในเครื่องแล้วเราดึงไปใช้ในเว็บผ่านไฟล์ [**serial-port.js**](https://github.com/bunnybunbun37204/vavsa/blob/main/servers/serial-port.js) แล้ว get ค่าใน **react** โดยใช้ **socket-io**

2. react-p5-demo
- อันนี้เหลือเยอะอยู่แต่ทำโครงนู่นนี่นั่นไว้บ้างแล้ว หน้าแรกจะเป็นการ display list song จาก database แล้วพอกดเข้าไปก็จะเจอกับวงแหวนหมุนๆ ตาม Amplitude เพลง โดยใช้ **p5.js** ในส่วนตรงนี้รบกวนธีช่วยเรื่อง web interface ด้วยคับ ;-;
- ยังขาด display หน้าใบเสร็จที่ทุกคนจะได้หลังจบเพลง เดี๋ยวไว้มาเวิร์คกัน ;-; 



## Screenshots

![App Screenshot](https://github.com/bunnybunbun37204/vavsa/blob/main/receiptify.jpg?raw=true)

3. server
- ตอนนี้เขียน api เกือบครบแล้วเหลือแค่ส่วนนำรับค่าตัวโน้ตไป gen ไฟล์เสียง ไฟล์เสียงใช้ mp3 หรือ wav ก็ได้ ส่วนนี้เกมรับผิดชอบเอง

