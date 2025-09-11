# ADSMANAT - Telegram Mini App

ADSMANAT is a comprehensive Telegram mini app that allows users to earn money by watching ads, completing tasks, and participating in events. The app features a modern neon-themed design with full mobile responsiveness.

## 🌟 Features

### Core Functionality
- **Ad Watching System**: Users can watch up to 20 ads per day, earning 1 bilet per ad
- **Wheel Spinning**: Convert bilet to ADSCOIN using an animated wheel with weighted probabilities
- **Task System**: Complete daily and special tasks to earn rewards
- **Event Participation**: Join special events and competitions
- **Withdrawal System**: Withdraw earnings via M10 payment system
- **Multi-language Support**: Azerbaijani, Russian, and English

### Technical Features
- **Responsive Design**: Optimized for mobile devices
- **Neon Theme**: Modern cyberpunk-inspired UI with glowing effects
- **Smooth Animations**: CSS3 animations and transitions
- **Progressive Web App**: Works offline with service worker
- **Real-time Updates**: Live balance and progress tracking
- **Security**: CSRF protection, rate limiting, and input validation

## 📱 Pages

1. **index.html** - Main earnings page with ad watching
2. **biletcoin.html** - Wheel spinning for bilet to ADSCOIN conversion
3. **events.html** - Special events and competitions
4. **tasks.html** - Daily and special tasks with verification
5. **withdraw.html** - M10 withdrawal form
6. **rules.html** - App rules and regulations
7. **settings.html** - Language selection and app settings
8. **verification.html** - Code verification for short links

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons
- **Progressive Web App**: Offline capabilities

### Backend
- **PHP 7.4+**: Server-side logic
- **MySQL 8.0**: Database
- **PDO**: Database abstraction
- **JSON API**: RESTful endpoints

## 🗄️ Database Schema

### Tables
- `users` - User profiles and Telegram data
- `user_balances` - Bilet, ADSCOIN, and AZN balances
- `ad_history` - Ad watching history
- `wheel_spins` - Wheel spinning records
- `task_completions` - Task completion tracking
- `withdrawal_requests` - Withdrawal requests
- `event_participations` - Event participation
- `verification_codes` - Short link verification codes
- `activity_logs` - User activity tracking
- `system_settings` - App configuration

## 🚀 Installation

### Prerequisites
- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 8.0 or higher
- SSL certificate (required for Telegram WebApp)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adsmanat.git
   cd adsmanat
   ```

2. **Database Setup**
   ```sql
   -- Import the database schema
   mysql -u username -p < database.sql
   ```

3. **Configure Database**
   ```php
   // Update config.php with your database credentials
   $host = 'your_host';
   $dbname = 'your_database';
   $username = 'your_username';
   $password = 'your_password';
   ```

4. **Set Bot Token**
   ```php
   // Update config.php with your Telegram bot token
   $botToken = 'YOUR_BOT_TOKEN';
   ```

5. **Upload Files**
   - Upload all files to your web server
   - Ensure proper file permissions (755 for directories, 644 for files)

6. **Configure Web Server**
   - Set document root to the project directory
   - Enable HTTPS (required for Telegram WebApp)
   - Configure URL rewriting if needed

## 📊 API Endpoints

### User Management
- `GET /api.php?action=user_data` - Get user data and balance
- `POST /api.php?action=watch_ad` - Watch ad and earn bilet
- `POST /api.php?action=spin_wheel` - Spin wheel for ADSCOIN
- `POST /api.php?action=complete_task` - Complete task and earn reward
- `POST /api.php?action=withdraw` - Submit withdrawal request
- `POST /api.php?action=join_event` - Join special event
- `POST /api.php?action=generate_code` - Generate verification code
- `POST /api.php?action=verify_code` - Verify code for tasks

### Request/Response Format
```json
// Request
{
  "user_id": 123456789,
  "action_data": "value"
}

// Response
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

## 🎨 Design System

### Color Palette
- **Primary**: #00ffff (Cyan)
- **Secondary**: #ff00ff (Magenta)
- **Background**: #1a1a1a (Dark Gray)
- **Text**: #ffffff (White)
- **Accent**: #ffff00 (Yellow)

### Typography
- **Font Family**: Arial, sans-serif
- **Headings**: Bold, 18-24px
- **Body**: Regular, 14-16px
- **Small**: Regular, 12-14px

### Components
- **Cards**: Rounded corners, neon borders, backdrop blur
- **Buttons**: Gradient backgrounds, hover effects, click animations
- **Forms**: Neon borders, focus states, validation feedback
- **Modals**: Backdrop blur, slide animations, close buttons

## 📱 Mobile Optimization

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Touch Interactions
- **Tap Effects**: Scale animations on touch
- **Swipe Gestures**: Wheel spinning, menu navigation
- **Long Press**: Context menus, additional options

### Performance
- **Lazy Loading**: Images and non-critical resources
- **Minification**: CSS and JavaScript optimization
- **Caching**: Service worker for offline functionality
- **Compression**: Gzip compression for assets

## 🔒 Security Features

### Data Protection
- **Input Sanitization**: All user inputs are sanitized
- **SQL Injection Prevention**: PDO prepared statements
- **XSS Protection**: HTML entity encoding
- **CSRF Protection**: Token-based validation

### Rate Limiting
- **Ad Watching**: 20 ads per day per user
- **API Calls**: Configurable rate limits
- **Withdrawal**: One request per 24 hours
- **Code Generation**: 5 codes per hour per user

### Authentication
- **Telegram WebApp**: Secure user authentication
- **Session Management**: Secure session handling
- **Activity Logging**: Comprehensive audit trail

## 🌐 Internationalization

### Supported Languages
- **Azerbaijani (az)**: Default language
- **Russian (ru)**: Full translation
- **English (en)**: Full translation

### Translation System
- **Client-side**: JavaScript-based translation
- **Server-side**: PHP translation arrays
- **Database**: Multi-language content support

## 📈 Analytics & Monitoring

### User Analytics
- **Ad Watching**: Daily statistics
- **Task Completion**: Success rates
- **Withdrawal Patterns**: Frequency and amounts
- **User Engagement**: Session duration, page views

### Performance Monitoring
- **API Response Times**: Database query optimization
- **Error Tracking**: Comprehensive error logging
- **Uptime Monitoring**: Service availability
- **Resource Usage**: Memory and CPU monitoring

## 🚀 Deployment

### Production Checklist
- [ ] SSL certificate installed
- [ ] Database configured and tested
- [ ] Bot token configured
- [ ] File permissions set correctly
- [ ] Error logging enabled
- [ ] Backup system configured
- [ ] Monitoring tools installed

### Environment Variables
```bash
# Database
DB_HOST=your_host
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password

# Telegram
BOT_TOKEN=your_bot_token
WEBHOOK_URL=your_webhook_url

# Security
CSRF_SECRET=your_csrf_secret
ENCRYPTION_KEY=your_encryption_key
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify MySQL service is running
   - Check firewall settings

2. **Telegram WebApp Not Working**
   - Ensure HTTPS is enabled
   - Check bot token configuration
   - Verify domain is whitelisted

3. **Mobile Display Issues**
   - Check viewport meta tag
   - Verify CSS media queries
   - Test on actual devices

4. **API Errors**
   - Check error logs
   - Verify input validation
   - Test API endpoints manually

### Debug Mode
```php
// Enable debug mode in config.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- **Telegram**: [@adsmanatofficial](https://t.me/adsmanatofficial)
- **Email**: support@adsmanat.com
- **Issues**: GitHub Issues

## 🎯 Roadmap

### Version 1.1
- [ ] Referral system
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Admin dashboard

### Version 1.2
- [ ] Multiple payment methods
- [ ] Advanced task types
- [ ] Social features
- [ ] Gamification elements

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Blockchain integration
- [ ] Multi-currency support

---

**Made with ❤️ by ADSMANAT Team**