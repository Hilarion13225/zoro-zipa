# 🐳 Zoro Zipa - Docker Deployment Guide

This guide explains how to deploy Zoro Zipa using Docker for production-ready deployment with persistent file storage.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      NGINX (Port 80)                     │
│  - Reverse proxy for backend and frontend               │
│  - Serves uploaded files statically (/uploads)          │
│  - Rate limiting & security headers                     │
│  - gzip compression                                     │
└────────────────┬────────────────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       ▼                    ▼
   ┌────────┐          ┌──────────┐
   │Backend │          │ Frontend │
   │ (8080) │          │  (3000)  │
   └────────┘          └──────────┘
       │
   ┌───┴──────────┐
   ▼              ▼
 [Data]      [Uploads]
 (H2 DB)    (Persistent)
```

## Prerequisites

- Docker & Docker Compose installed
- 2GB+ free disk space
- Ports 80, 8080, 3000 available (or configure different ports)

## Quick Start

### 1. Clone and Setup

```bash
git clone <repo-url>
cd zoro-zipa
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 3. Start with Docker

**On Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**On Windows:**
```bash
docker-start.bat
```

Or manually:
```bash
docker-compose build
docker-compose up -d
```

### 4. Access Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Uploads:** http://localhost/uploads

## File Storage

### Local Development
Files uploaded via admin panel are stored in:
- **Host machine:** `./uploads/`
- **Docker volume:** `zoro-uploads`

### Production Deployment
The Docker volume `zoro-uploads` persists across container restarts:
```bash
docker volume inspect zoro-uploads
```

## Database Persistence

The H2 database file is stored in:
- **Host machine:** `./data/zoro-zipa*`
- **Docker volume:** `zoro-data`

This ensures data survives container restarts.

## Common Commands

### View Logs
```bash
docker-compose logs -f                    # All services
docker-compose logs -f backend            # Backend only
docker-compose logs -f frontend           # Frontend only
docker-compose logs -f nginx              # Nginx only
```

### Restart Services
```bash
docker-compose restart                    # Restart all
docker-compose restart backend            # Restart backend only
```

### Stop and Remove
```bash
docker-compose down                       # Stop containers (keep volumes)
docker-compose down -v                    # Stop and remove all (including volumes)
```

### Access Backend Console
```bash
docker-compose exec backend bash
```

### Check Container Status
```bash
docker-compose ps
```

## Troubleshooting

### Uploads Not Showing

1. **Check volume mounting:**
   ```bash
   docker volume ls
   docker volume inspect zoro-uploads
   ```

2. **Verify nginx is serving uploads:**
   ```bash
   docker-compose logs nginx | grep uploads
   ```

3. **Check permissions:**
   ```bash
   docker-compose exec nginx ls -la /var/www/uploads
   ```

### Backend Connection Error

1. **Check backend logs:**
   ```bash
   docker-compose logs backend
   ```

2. **Verify backend is healthy:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

3. **Check Docker network:**
   ```bash
   docker network inspect zoro-network
   ```

### Frontend Not Loading

1. **Check frontend logs:**
   ```bash
   docker-compose logs frontend
   ```

2. **Verify nginx config:**
   ```bash
   docker-compose exec nginx nginx -t
   ```

3. **Check frontend build:**
   ```bash
   docker-compose exec frontend ls -la /usr/share/nginx/html
   ```

## Production Deployment

### Enable HTTPS

1. **Prepare SSL certificates:**
   ```bash
   mkdir -p ssl
   # Place cert.pem and key.pem in ssl/
   ```

2. **Uncomment SSL block in nginx.conf**

3. **Restart nginx:**
   ```bash
   docker-compose restart nginx
   ```

### Environment Configuration

Set environment variables in `.env`:
```env
MAIL_USERNAME=production-email@gmail.com
MAIL_PASSWORD=production-password
APP_EMAIL_ADMIN=admin@yourdomain.com
```

### Database Backup

```bash
# Backup H2 database
docker run --rm \
  -v zoro-data:/data \
  -v $(pwd)/backups:/backups \
  alpine cp -r /data/* /backups/

# Restore from backup
docker run --rm \
  -v zoro-data:/data \
  -v $(pwd)/backups:/backups \
  alpine cp -r /backups/* /data/
```

### Uploads Backup

```bash
# Backup uploads
docker run --rm \
  -v zoro-uploads:/uploads \
  -v $(pwd)/backups:/backups \
  alpine tar czf /backups/uploads-$(date +%Y%m%d).tar.gz -C /uploads .
```

## Performance Tuning

### Increase Upload Limit

Edit `docker-compose.yml`:
```yaml
environment:
  MAX_UPLOAD_SIZE=200M
```

Edit `nginx.conf`:
```nginx
client_max_body_size 200M;
```

### Scale Backend

Create multiple backend instances:
```yaml
backend:
  deploy:
    replicas: 3
```

Then add load balancer in nginx upstream.

## Security Best Practices

1. **Never commit .env file** (contains passwords)
2. **Use strong email passwords** (app-specific password for Gmail)
3. **Enable HTTPS in production** (uncomment SSL in nginx.conf)
4. **Regularly backup data** (automated daily backups recommended)
5. **Keep Docker images updated** (rebuild periodically)
6. **Use firewall rules** to restrict port access

## Monitoring

### Health Checks

All services have health checks:
```bash
docker-compose ps
# Shows health status for each service
```

### Check Disk Usage

```bash
docker system df
```

### Monitor Container Resources

```bash
docker stats
```

## Cleanup

### Remove Unused Volumes

```bash
docker volume prune
```

### Remove Unused Images

```bash
docker image prune
```

### Full Cleanup (Caution!)

```bash
docker system prune -a --volumes
```

## Support

For issues or questions, check logs first:
```bash
docker-compose logs --tail=100
```

Then consult the main README.md for more information.
