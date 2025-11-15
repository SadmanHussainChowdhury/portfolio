# MongoDB Atlas Quick Setup Guide

## 🚀 Quick Steps to Configure Network Access

### 1. Login to MongoDB Atlas
- Go to: https://cloud.mongodb.com/
- Sign in with your account

### 2. Navigate to Network Access
- Click on your **Project** (top left)
- Click **"Network Access"** in the left sidebar
- Or go directly: https://cloud.mongodb.com/v2#/security/network/whitelist

### 3. Add IP Address
- Click **"Add IP Address"** button (green button)
- Click **"Allow Access from Anywhere"** button
- This will automatically fill: `0.0.0.0/0`
- Add a comment: "Vercel and Local Development"
- Click **"Confirm"**

### 4. Wait for Activation
- Status will show as "Pending" initially
- Wait 1-2 minutes
- Status will change to **"Active"** (green checkmark)

### 5. Verify Your Connection String
Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

## ✅ That's It!

Once the IP address is Active, your application can connect to MongoDB from:
- ✅ Vercel (production)
- ✅ Your local machine (development)
- ✅ Any other server

## 🔒 Security Note

Using `0.0.0.0/0` is safe because:
- MongoDB requires authentication (username/password)
- Your connection string includes credentials
- Only apps with the correct connection string can connect

## 📝 Next Steps

1. Set `MONGODB_URI` in Vercel environment variables
2. Deploy your application
3. Test the connection

## 🆘 Still Having Issues?

Check:
- [ ] IP address status is "Active" (not "Pending")
- [ ] Connection string is correct
- [ ] Database user exists and has permissions
- [ ] Cluster is running (not paused)

For detailed instructions, see: `MONGODB_NETWORK_ACCESS.md`

