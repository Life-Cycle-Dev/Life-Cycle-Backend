## 🤖 Life Cycle Backend Project Guide

โค้ดระบบหลังบ้านของ Life Cycle Application เขียนโดยใช้ strapi ภาษา javaScript อ่าน doc ได้ [ที่นี่](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html#open-source-contribution)

## 😶‍🌫️ Installation Guide

**Environment ที่สำคัญ** 
- node v.16.15.0 
- npm v.8.5.5

**Devolopment**
```bash
  1: 📄 npm install
  2: 📄 npm run dev
```

**Unit testing**
เปลี่ยน `NODE_ENV=test` ที่ `.env` ไฟล์
```bash
  1: 📄 npm test
```

**คำเตือน 💣**
- ห้าม push secret ต่าง ๆ ขึ้นมา
- ถ้าฝ่าฝืนจะโดนยิง ถ้ายังไม่ตายจะโดนยิงซ้ำ


## 💣 Life Cycle Backend Development Role
- ให้ตั้งชื่อ branch ด้วย `{ชื่อเล่น}/{เลข task ใน jira}/{สุดยอดฟังก์ชั่นที่พัฒนา}`
- ในการเปิด pull request ให้ใช้ชื่อ `[{เลข task ใน jira}] {สุดยอดฟังก์ชั่นที่พัฒนา}` ทุกครั้ง และใช้ pull_request_template แล้วกรอกรายละเอียดในส่วนที่จำเป็นดังนี้
    - link ไปยัง jira
    - รายละเอียดโค้ดที่แก้อธิบายคร่าว ๆ (What i do)
    - หลังจากที่ pull request ถูก merge ไปเเล้วต้องทำยังไงในแต่ละ environment (Owner Checklist)
- หากรายละเอียดของ pull request ดังกล่าวไม่ครบถ้วน ห้าม merge เด็ดขาด! หากฝ่าฝืนจะโดน rollback code ออก
- ต้องมีคน approved ครบตั้งแต่ 1 คนชึ้นไปและคนที่ approved ต้องติ้กในส่วนของ Approver Checklist ให้ครบทุกส่วน
- สามารถ merge dev ได้ตลอดโดยไม่ต้องรอ approved ครบ

Happy Develop :)

## 😶‍🌫️ Environment
- dev - http://backend.lifecycleapp.online/admin
- prod - 