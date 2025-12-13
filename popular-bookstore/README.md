# Popular Bookstore - Angular Application

A modern, feature-rich online bookstore application built with Angular 17. This is a complete rewrite of the original project using Angular framework.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Product Management**: Browse, search, and filter products
- **Checkout System**: Complete checkout flow with form validation
- **Responsive Design**: Mobile-first approach, works on all devices
- **State Management**: RxJS-based reactive state management
- **Toast Notifications**: User-friendly feedback system
- **Lazy Loading**: Optimized performance with lazy-loaded modules

## 🛠️ Technology Stack

- **Framework**: Angular 17
- **Language**: TypeScript 5.2
- **Styling**: CSS3 with CSS Variables
- **State Management**: RxJS (BehaviorSubject, Observables)
- **Forms**: Reactive Forms with custom validators
- **Routing**: Angular Router with lazy loading
- **Icons**: Font Awesome 6.5
- **Fonts**: Google Fonts (Inter)

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:4200`

3. **Build for Production**
   ```bash
   npm run build
   ```
   
   Build artifacts will be in the `dist/` directory

## 📁 Project Structure

```
popular-bookstore/
├── src/
│   ├── app/
│   │   ├── components/          # Shared components
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── cart-sidebar/
│   │   │   └── toast/
│   │   ├── pages/               # Page components
│   │   │   ├── home/
│   │   │   └── checkout/
│   │   ├── services/            # Core services
│   │   │   ├── cart.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── toast.service.ts
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── product.model.ts
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   └── app.component.ts
│   ├── assets/                  # Static assets
│   │   └── image/
│   ├── styles.css               # Global styles
│   └── index.html
├── angular.json                 # Angular CLI config
├── package.json
└── tsconfig.json
```

## 🎯 Core Features Implementation

### Shopping Cart Service
- Persistent cart storage using localStorage
- Real-time cart count and total calculation
- Add/Remove/Update quantity functionality
- Observable-based state management

### Product Service
- Product catalog management
- Search and filter functionality
- Category-based filtering
- Product details retrieval

### Authentication Service
- User login/logout
- Session persistence
- Auth guards for protected routes

### Toast Service
- Global notification system
- Success/Error/Warning/Info types
- Auto-dismiss with customizable duration

## 🎨 Styling Architecture

- **CSS Variables**: Consistent theming
- **BEM Methodology**: Component-scoped styles
- **Responsive Design**: Mobile-first breakpoints
- **Animations**: Smooth transitions and keyframe animations
- **Gradients**: Modern gradient backgrounds

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🔒 Form Validation

The checkout form includes:
- Required field validation
- Email format validation
- Phone number pattern validation
- Credit card validation (when selected)
- Real-time error messages
- Custom validators

## 🚦 Routing

- `/` - Home page with featured products
- `/books` - Books catalog
- `/stationery` - Stationery products
- `/checkout` - Checkout page (lazy loaded)
- `/account` - User account
- `/contact` - Contact us
- `/careers` - Career opportunities
- `/promotions` - Special offers
- `/privacy` - Privacy policy
- `/locations` - Store locations

## 🔄 State Management

Using RxJS Observables for reactive state management:
- `BehaviorSubject` for state containers
- `Observable` streams for data flow
- Async pipe in templates for automatic subscription management

## 📝 Development Guidelines

1. **Component Creation**: Use Angular CLI
   ```bash
   ng generate component components/component-name
   ```

2. **Service Creation**:
   ```bash
   ng generate service services/service-name
   ```

3. **Lazy-loaded Module**:
   ```bash
   ng generate module pages/module-name --route module-name --module app.module
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   ng serve --port 4201
   ```

2. **Dependencies error**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**
   ```bash
   ng build --configuration production --verbose
   ```

## 🎓 Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This project is part of a Front-End Development assignment for revamping the Popular Bookstore website.

## 👥 Contributors

- Frontend Development Assignment 1
- Course: Front-End Development
- Target: Revamp Popular Malaysia Online Bookstore

## 🔮 Future Enhancements

- [ ] User authentication with backend API
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order history
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Happy Coding! 🎉**
