# ADSMANAT - Telegram Mini App

ADSMANAT is a comprehensive Telegram mini app that allows users to earn money by watching ads, completing tasks, and participating in events. Users can convert their earnings to ADSCOİN and withdraw to M10 wallet.

## 🌟 Features

### Main Features
- **Ad Watching System**: Watch up to 20 ads daily to earn bilet
- **Bilet to ADSCOİN Conversion**: Spin wheel to convert bilet to ADSCOİN
- **Task System**: Complete daily and special tasks to earn rewards
- **Event Participation**: Join special events and earn bonus rewards
- **Withdrawal System**: Withdraw earnings to M10 wallet
- **Multi-language Support**: Azerbaijani, Russian, and English
- **Mobile Responsive**: Optimized for mobile devices

### Technical Features
- **Modern UI/UX**: Neon-themed design with smooth animations
- **Real-time Updates**: Live balance and progress tracking
- **Secure Backend**: PHP with MySQL database
- **Telegram Integration**: Seamless Telegram WebApp integration
- **Code Verification**: Secure task completion verification
- **Data Persistence**: User data stored in database and localStorage

## 📱 Pages

1. **QAZANC (index.html)** - Main earning page with ad watching
2. **BİLET-COİN (biletcoin.html)** - Convert bilet to ADSCOİN
3. **HADİSƏLƏR (events.html)** - Special events and promotions
4. **GÖREVLƏR (tasks.html)** - Daily and special tasks
5. **ÇIXARIŞ (withdraw.html)** - Withdrawal to M10 wallet
6. **QAYDALAR (rules.html)** - App rules and regulations
7. **AYARLAR (settings.html)** - Language and app settings
8. **VERIFICATION (verification.html)** - Task verification system

## 🛠️ Installation

### Prerequisites
- Web server with PHP 7.4+ support
- MySQL 5.7+ database
- InfinityFree hosting account (or similar)

### Database Setup

1. **Create Database**:
   ```sql
   CREATE DATABASE if0_39059246_adcmanat;
   ```

2. **Import Database Schema**:
   ```bash
   mysql -u if0_39059246 -p if0_39059246_adcmanat < database_setup.sql
   ```

3. **Update Database Credentials** in `config.php`:
   ```php
   define('DB_HOST', 'sql211.infinityfree.com');
   define('DB_NAME', 'if0_39059246_adcmanat');
   define('DB_USER', 'if0_39059246');
   define('DB_PASS', 'n4TEZuJcP2rq5');
   ```

### File Upload

1. Upload all files to your web server
2. Ensure proper file permissions (755 for directories, 644 for files)
3. Make sure `api.php` is accessible via HTTP

### Telegram Bot Setup

1. Create a Telegram bot via @BotFather
2. Get your bot token
3. Update `config.php` with your bot token:
   ```php
   define('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE');
   ```

4. Set webhook URL:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
   -d "url=https://yourdomain.com/webhook.php"
   ```

## 🎨 Design Features

### Color Scheme
- **Primary**: Neon Cyan (#00ffff)
- **Secondary**: Neon Pink (#ff00ff)
- **Background**: Dark Grey (#1a1a1a)
- **Accent**: Neon Green (#00ff00)

### Animations
- Smooth slide transitions
- Hover effects on interactive elements
- Loading animations
- Confetti effects for rewards
- Floating bubble background

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly interface
- Swipe gestures for navigation
- Optimized for mobile performance

## 🔧 Configuration

### System Settings
- Daily ad limit: 20 ads
- Minimum withdrawal: 3000 ADSCOİN (3 AZN)
- ADSCOİN to AZN rate: 0.001
- Verification code expiry: 10 minutes

### Task Rewards
- YouTube subscription: 5 ADSCOİN
- Telegram channel: 5 ADSCOİN
- TikTok follow: 5 ADSCOİN
- Short link verification: 3 ADSCOİN

## 📊 Database Schema

### Tables
- `users` - User information and Telegram data
- `user_balances` - User balance tracking
- `ad_watches` - Daily ad watch tracking
- `task_completions` - Task completion history
- `withdrawals` - Withdrawal requests
- `verification_codes` - Task verification codes
- `events` - Special events and promotions
- `event_participants` - Event participation tracking
- `system_settings` - App configuration

## 🔌 API Endpoints

### User Management
- `GET /api.php?action=get_user&telegram_id={id}` - Get user data
- `POST /api.php?action=update_user` - Update user information

### Balance Management
- `GET /api.php?action=get_balance&telegram_id={id}` - Get user balance
- `POST /api.php?action=update_balance` - Update user balance

### Ad System
- `POST /api.php?action=watch_ad` - Process ad watch

### Task System
- `POST /api.php?action=complete_task` - Complete a task
- `POST /api.php?action=generate_verification_code` - Generate verification code
- `POST /api.php?action=verify_code` - Verify task completion code

### Withdrawal System
- `POST /api.php?action=create_withdrawal` - Create withdrawal request
- `GET /api.php?action=get_withdrawals&telegram_id={id}` - Get withdrawal history

### Event System
- `POST /api.php?action=join_event` - Join an event
- `GET /api.php?action=get_events` - Get active events

## 🚀 Usage

### For Users
1. Open the app in Telegram
2. Watch ads to earn bilet
3. Convert bilet to ADSCOİN using the wheel
4. Complete tasks for additional rewards
5. Join events for bonus earnings
6. Withdraw earnings to M10 wallet

### For Administrators
1. Monitor user activity through database
2. Manage events and promotions
3. Process withdrawal requests
4. Update system settings as needed

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure session management
- Data encryption for sensitive information

## 📱 Mobile Features

- Touch gestures for navigation
- Haptic feedback for interactions
- Optimized loading times
- Offline data caching
- Responsive design

## 🌐 Multi-language Support

- Azerbaijani (default)
- Russian
- English
- Easy to add more languages

## 🎯 Future Enhancements

- Referral system
- Push notifications
- Advanced analytics
- Admin dashboard
- More payment methods
- Social features

## 📞 Support

For support and questions:
- Telegram: @adsmanatofficial
- Email: support@adsmanat.com

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For collaboration inquiries, please contact the development team.

---

**ADSMANAT Team** - 2024