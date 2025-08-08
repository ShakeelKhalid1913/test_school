# Test School - Deployment Guide

This guide provides instructions for deploying the Test School Competency Assessment Platform to production.

## 📋 Prerequisites

- Server with Node.js 16+ installed
- MongoDB database (local or cloud)
- Domain name (optional)
- SSL certificate (recommended)

## 🚀 Backend Deployment

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install MongoDB (if using local database)
# Follow MongoDB installation guide for your OS
```

### 2. Deploy Backend

```bash
# Clone repository
git clone <your-repository-url>
cd test_school/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Create production environment file
cp .env.example .env.production

# Configure production environment variables
nano .env.production
```

### 3. Environment Configuration (.env.production)

```env
NODE_ENV=production
PORT=5000

# Production MongoDB URI
MONGODB_URI=mongodb://localhost:27017/test_school_prod
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/test_school

# Strong JWT secrets (generate new ones for production)
JWT_ACCESS_SECRET=your_very_strong_access_secret_here
JWT_REFRESH_SECRET=your_very_strong_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_app_password

# Production frontend URL
FRONTEND_URL=https://yourdomain.com

OTP_EXPIRY=10m
```

### 4. Start Backend with PM2

```bash
# Start application with PM2
pm2 start dist/index.js --name "test-school-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## 🎨 Frontend Deployment

### Option 1: Static Hosting (Netlify, Vercel, etc.)

```bash
# Build for production
cd frontend
npm install
npm run build

# Deploy the 'build' folder to your hosting service
```

### Option 2: Server Deployment

```bash
# Install serve globally
sudo npm install -g serve

# Serve the built application
serve -s build -l 3000

# Or use PM2
pm2 serve build 3000 --name "test-school-frontend"
```

## 🌐 Web Server Configuration (Nginx)

### Install Nginx

```bash
sudo apt install nginx
```

### Configure Nginx

Create `/etc/nginx/sites-available/test-school`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /path/to/test_school/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/test-school /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🗄️ Database Setup

### MongoDB Production Setup

```bash
# Create production database user
mongo
use test_school_prod
db.createUser({
  user: "testschool_user",
  pwd: "strong_password_here",
  roles: [{ role: "readWrite", db: "test_school_prod" }]
})

# Enable authentication in MongoDB config
sudo nano /etc/mongod.conf

# Add these lines:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

### Backup Strategy

```bash
# Create backup script
nano backup.sh

#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
mongodump --db test_school_prod --out /backups/mongodb_$DATE
tar -czf /backups/mongodb_$DATE.tar.gz /backups/mongodb_$DATE
rm -rf /backups/mongodb_$DATE

# Make executable and add to cron
chmod +x backup.sh
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

## 📊 Monitoring

### PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs test-school-backend

# Monitor CPU and memory
pm2 monit

# Restart application
pm2 restart test-school-backend
```

### Log Management

```bash
# Setup log rotation for PM2
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## 🔧 Performance Optimization

### Backend Optimizations

1. **Enable gzip compression** in Express
2. **Use Redis** for session storage (optional)
3. **Implement rate limiting** (already included)
4. **Database indexing** for frequently queried fields

### Frontend Optimizations

1. **Code splitting** with React.lazy()
2. **Image optimization**
3. **CDN usage** for static assets
4. **Service worker** for caching

## 🔐 Security Checklist

- [ ] Strong JWT secrets
- [ ] HTTPS enabled
- [ ] Database authentication enabled
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] Input validation and sanitization
- [ ] CORS properly configured
- [ ] Environment variables secured

## 📋 Post-Deployment Steps

1. **Create admin user** through database or API
2. **Test all functionality** in production
3. **Setup monitoring and alerts**
4. **Configure automated backups**
5. **Document admin credentials** securely
6. **Setup domain and SSL**
7. **Test email functionality**

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 3000/5000 are available
2. **MongoDB connection**: Verify connection string and credentials
3. **CORS errors**: Check FRONTEND_URL in backend .env
4. **Build failures**: Ensure all dependencies are installed
5. **SSL issues**: Verify certificate installation

### Health Checks

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check database connection
mongo --eval "db.adminCommand('ismaster')"

# Check application logs
pm2 logs test-school-backend --lines 50
```

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review Nginx error logs: `/var/log/nginx/error.log`

---

**Note**: This deployment guide assumes a Linux-based server. Adjust commands as needed for your specific environment.
