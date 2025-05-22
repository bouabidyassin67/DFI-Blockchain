
# DFI Blockchain Academy

A comprehensive e-learning platform for blockchain education, featuring courses, quizzes, IQ tests, and certificates.

## Features

- **Authentication**: Email/password authentication with email verification
- **User Profiles**: Personal profiles with role-based permissions
- **Courses**: Browse, purchase, and enroll in courses
- **Quizzes & IQ Tests**: Interactive assessments with premium content
- **Progress Tracking**: Track learning progress across courses
- **Communication**: Direct messaging, class discussions, and announcements
- **Certificates**: Earn certificates upon course completion
- **Subscription Plans**: Basic and premium subscription tiers
- **Admin Dashboard**: Manage users, content, and analyze data

## Backend Setup Instructions

This application uses Supabase as its backend. Follow these steps to set up the backend:

### 1. Set up Supabase Project

1. Sign up or log in at [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys (you'll need these later)

### 2. Configure Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set up Database Tables

Run the SQL commands found in the `database-setup.sql` file in your Supabase SQL editor.
This will:
- Create all required tables (profiles, courses, enrollments, IQ tests, quizzes, certificates, purchases)
- Set up appropriate relationships between tables
- Configure Row Level Security policies
- Add sample data

### 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL and redirect URLs
3. Set up email templates for confirmation and password reset

### 5. Storage Setup

For storing course images and other assets:
1. Go to Storage in your Supabase dashboard
2. Create buckets for "courses", "avatars", and "certificates"
3. Configure appropriate RLS policies

## Database Schema

The application uses the following main tables:

### 1. profiles
- Stores user profile information
- Fields: id, name, role, subscription_tier, purchased_courses, avatar_url, phone, bio, address

### 2. courses
- Stores course information
- Fields: id, title, description, thumbnail, instructor_id, price, level, duration, modules_count, published, subscription_required

### 3. course_modules
- Stores course module information
- Fields: id, course_id, title, description, order_index, duration, content_type, content_url

### 4. enrollments
- Tracks user enrollment and progress in courses
- Fields: id, user_id, course_id, completed_modules, total_modules, start_date, completion_date, last_accessed_at, progress_percentage

### 5. quizzes and quiz_questions
- Store quiz information and questions
- Fields: id, title, description, course_id, passing_score, time_limit, attempts_allowed, published

### 6. iq_tests and iq_test_questions
- Store IQ test information and questions
- Fields: id, title, description, time_limit, question_count, premium_required, published

### 7. certificates
- Stores user certificates for completed courses
- Fields: id, user_id, course_id, certificate_url, issue_date, verification_code

### 8. messages
- Stores communication messages
- Fields: id, sender_id, receiver_id, content, room_id, read, is_system

### 9. purchases
- Tracks payment transactions
- Fields: id, user_id, amount, currency, product_type, product_id, status, payment_method, transaction_id

### 10. subscription_plans
- Stores available subscription plans
- Fields: id, name, price, period, description, features, highlight, tier

## Security

- **Row Level Security**: All tables have RLS policies to ensure users can only access their own data
- **Role-based Authorization**: Admin-only features are protected by role checks
- **Secure Authentication**: Email verification and password reset flows

## API Endpoints

The app uses Supabase's client library for most operations:

- **Authentication**: Login, registration, password reset
- **User Profile**: Get and update user profiles
- **Courses**: List, view, enroll, track progress
- **Quizzes**: Attempt quizzes, submit answers, view results
- **IQ Tests**: Attempt tests, calculate IQ scores
- **Communication**: Send messages, view discussions and announcements
- **Subscriptions**: View plans, purchase subscriptions

## Running the Application

Once the backend is set up, run your app:

```
npm install
npm run dev
```

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Verify that all SQL tables are created with proper relationships
3. Ensure RLS policies are correctly configured
4. Check Supabase logs for authentication or database errors
5. Make sure storage buckets are properly configured

## Admin Setup

To create an admin user:
1. Register a normal user account
2. Use the SQL editor in Supabase to run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
   ```
3. Sign out and log back in to refresh the user session

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/en/main)
- [Shadcn UI Documentation](https://ui.shadcn.com)
