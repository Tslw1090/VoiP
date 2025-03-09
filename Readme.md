# 📞 VoIP App — Browser-Based Phone for Open PBX  
A lightweight, browser-based VoIP solution designed to replace desktop SIP clients like MicroSIP. This app allows users to log in with their Open PBX extension and password, make calls, and view call history — all from their browser.

---

## 🚀 **Features**
✅ Login using your **Extension Number** and **Password**  
✅ Fully functional **Dialpad** with call control (mute/unmute)  
✅ **Call History** — Users can only access their own logs  
✅ **Call Recordings** — Users can only access their own recordings  
✅ **No App Installation Required** — Runs directly in the browser  

---

## 📂 **Project Structure**
```
/voip-app
 ├── /client
 │   ├── index.html      --> Frontend UI
 │   ├── app.js          --> Frontend Logic
 │   └── config.js       --> Frontend Config (optional)
 ├── server.js            --> Backend Logic (Express + SIP.js)
 ├── .env                 --> Environment Variables
 ├── package.json         --> Dependencies & Scripts
 └── README.md            --> Project Documentation
```

---

## ⚙️ **Installation Guide**

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/your-repo/voip-app.git
cd voip-app
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Add `.env` File**
Create a `.env` file in the root directory and add the following:

```
PORT=3000
SIP_DOMAIN=139.84.175.21:65236
SIP_SERVER=udp://139.84.175.21:65236
TRANSPORT=UDP
```

### **Step 4: Start the Server**
For production mode:  
```bash
npm start
```

For development mode (with auto-restart on changes):  
```bash
npm run dev
```

---

## 🌐 **Usage**
1. Open your browser and visit: **`http://localhost:3000`**  
2. Enter your **Extension Number** and **Password** to log in.  
3. Use the **Dialpad** to make calls.  
4. Access your **Call History** and **Recordings** from the UI.  

---

## 🛠️ **Configuration**
### **PBX Server Configuration**
Ensure your PBX settings match the following:  
✅ **SIP Server:** `139.84.175.21:65236`  
✅ **Domain:** `139.84.175.21:65236`  
✅ **Transport Protocol:** `UDP`  
✅ **Port 65236** must be open in your firewall settings.

---

## 🧪 **Testing Tips**
✅ Verify SIP registration by checking PBX logs.  
✅ Test outbound and inbound calls for audio clarity.  
✅ Confirm call logs and recordings are correctly associated with each user.  

---

## ❓ **Troubleshooting**
1. **Registration Failed?**  
   - Check PBX credentials (extension number & password).  
   - Ensure port **65236** is open for UDP traffic.  

2. **Audio Issues?**  
   - Verify your PBX server's **NAT** and **RTP port ranges** are configured correctly.  

---

## 📋 **Future Enhancements**
✅ Add **Call Transfer** feature  
✅ Implement **Voicemail Integration**  
✅ Develop a **Mobile-Friendly UI**  

---

## 👨‍💻 **Contributing**
Contributions are welcome! Feel free to submit issues or pull requests.

---

## 📜 **License**
This project is licensed under the **MIT License**.

---

If you have any questions or want to expand functionality, feel free to ask! 🚀
