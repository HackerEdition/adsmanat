# ADSMANAT - Telegram Mini App

ADSMANAT is a Telegram mini app where users can earn money by watching ads and converting tickets to ADSCoin, which can be withdrawn via M10.

## Features

### 🎯 Main Features
- **Ad Watching**: Users can watch up to 20 ads per day to earn tickets
- **Spin Wheel**: Convert tickets to ADSCoin using a probability-based wheel
- **Withdrawal System**: Withdraw earnings via M10 (minimum 3000 ADSCoin = 3 AZN)
- **Task System**: Complete special tasks and daily short link tasks for rewards
- **Events**: Participate in special events and contests
- **Multi-language Support**: Azerbaijani, Russian, and English

### 📱 Pages
1. **Main Page (index.html)**: Ticket earning through ad watching
2. **Bilet-Coin (biletcoin.html)**: Spin wheel to convert tickets to ADSCoin
3. **Events (events.html)**: Special events and contests
4. **Tasks (tasks.html)**: Special tasks and daily short link tasks with verification
5. **Withdraw (withdraw.html)**: M10 withdrawal form
6. **Rules (rules.html)**: General rules and event-specific rules
7. **Settings (settings.html)**: Language selection and support
8. **Verification (verification.html)**: Code generator for short link verification
9. **Friends (friends.html)**: Referral system (coming soon)

## Database Setup

### MySQL Tables
Run the SQL commands from `database_setup.sql` to create the required tables:
- `users`: User information from Telegram
- `user_balance`: User balance (tickets, ADSCoin, AZN)
- `ad_views`: Ad viewing statistics
- `withdrawals`: Withdrawal requests
- `tasks_completed`: Completed tasks tracking

### Database Configuration
Update the database credentials in `api/config.php`:
```php
define('DB_HOST', 'sql211.infinityfree.com');
define('DB_NAME', 'if0_39059246_adcmanat');
define('DB_USER', 'if0_39059246');
define('DB_PASS', 'n4TEZuJcP2rq5');
```

## File Structure

```
/
├── index.html              # Main page (ticket earning)
├── biletcoin.html          # Spin wheel page
├── events.html             # Events page
├── tasks.html              # Tasks page
├── withdraw.html           # Withdrawal page
├── rules.html              # Rules page
├── settings.html           # Settings page
├── verification.html       # Code verification page
├── friends.html            # Referral page (coming soon)
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
├── biletcoin.css           # Bilet-coin specific styles
├── biletcoin.js            # Bilet-coin specific JavaScript
├── tasks.css               # Tasks specific styles
├── tasks.js                # Tasks specific JavaScript
├── withdraw.css            # Withdraw specific styles
├── withdraw.js             # Withdraw specific JavaScript
├── rules.css               # Rules specific styles
├── rules.js                # Rules specific JavaScript
├── settings.css            # Settings specific styles
├── settings.js             # Settings specific JavaScript
├── verification.css        # Verification specific styles
├── verification.js         # Verification specific JavaScript
├── .htaccess               # Apache configuration
├── database_setup.sql      # Database setup script
└── api/
    ├── config.php          # Database configuration
    ├── save_user.php       # Save/update user data
    ├── get_user_data.php   # Get user data and balance
    ├── update_balance.php  # Update user balance
    ├── submit_withdrawal.php # Submit withdrawal request
    ├── complete_task.php   # Complete task and give reward
    └── get_completed_tasks.php # Get user's completed tasks
```

## Installation

1. **Upload Files**: Upload all files to your InfinityFree hosting account
2. **Database Setup**: Run the SQL commands from `database_setup.sql` in your MySQL database
3. **Configuration**: Update database credentials in `api/config.php`
4. **Telegram Bot Setup**: 
   - Create a new bot via @BotFather
   - Set up the mini app in your bot settings
   - Configure the web app URL to point to your hosted domain

## API Endpoints

### POST /api/save_user.php
Save or update user information from Telegram

### GET /api/get_user_data.php?telegram_id={id}
Get user data, balance, and ad viewing statistics

### POST /api/update_balance.php
Update user balance (tickets, ADSCoin, AZN, ad views)

### POST /api/submit_withdrawal.php
Submit a withdrawal request

### POST /api/complete_task.php
Mark a task as completed and give reward

### GET /api/get_completed_tasks.php?telegram_id={id}
Get list of completed tasks for a user

## Security Features

- Input sanitization and validation
- SQL injection prevention using prepared statements
- CORS headers for secure API access
- Transaction-based database operations
- Error logging without exposing sensitive information

## Currency System

- **1 Ticket** = Earned by watching 1 ad
- **1 ADSCoin** = 0.001 AZN
- **Minimum Withdrawal** = 3000 ADSCoin (3 AZN)
- **Daily Ad Limit** = 20 ads per user

## Task System

### Special Tasks (One-time)
- YouTube subscription: 5 ADSCoin
- Telegram channel subscription: 5 ADSCoin
- TikTok follow: 5 ADSCoin

### Daily Tasks
- Short link tasks with code verification
- Variable rewards (1-3 ADSCoin)
- Code generator system for verification

## Responsive Design

The app is fully responsive and optimized for mobile devices, with:
- Touch-friendly interface
- Smooth animations and transitions
- Bubble background effects
- Neon-themed design with blue and pink colors

## Browser Support

- Modern mobile browsers
- Telegram WebView
- Chrome, Firefox, Safari
- iOS and Android devices

## License

This project is developed for ADSMANAT Telegram Mini App. All rights reserved.

## Support

For technical support, contact: https://t.me/c/2252090240/123